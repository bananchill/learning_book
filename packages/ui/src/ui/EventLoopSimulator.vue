<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

/* ═══════════════════════════════════════════════════════════
   Типы
   ═══════════════════════════════════════════════════════════ */

interface Token {
  type: 'log' | 'setTimeout' | 'promise' | 'raf' | 'fetch'
  value?: string
  delay?: number
  body?: string
  line: number
}

interface SimStep {
  title: string
  desc: string
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  rafQueue: string[]
  output: string[]
  highlight: Phase
  codeLine: number
}

type Phase = 'callstack' | 'webapi' | 'micro' | 'macro' | 'render' | 'eventloop'

/* ═══════════════════════════════════════════════════════════
   Движок: парсинг и симуляция
   ═══════════════════════════════════════════════════════════ */

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  const lines = code.split('\n')
  let i = 0

  function readBlock(startLine: number) {
    let depth = 0
    const blockLines: string[] = []
    for (let j = startLine; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '{') depth++
        if (ch === '}') depth--
      }
      blockLines.push(lines[j])
      if (depth <= 0 && blockLines.length > 0)
        return { endLine: j, body: blockLines.join('\n') }
    }
    return { endLine: lines.length - 1, body: blockLines.join('\n') }
  }

  function extractInner(blockBody: string): string {
    const first = blockBody.indexOf('{')
    if (first === -1) return ''
    let depth = 0
    let last = blockBody.length - 1
    for (let k = first; k < blockBody.length; k++) {
      if (blockBody[k] === '{') depth++
      if (blockBody[k] === '}') {
        depth--
        if (depth === 0) { last = k; break }
      }
    }
    return blockBody.substring(first + 1, last).trim()
  }

  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (!trimmed || /^[}\])\s;,]*$/.test(trimmed)) { i++; continue }

    const logMatch = trimmed.match(/console\.log\(\s*["'`](.+?)["'`]\s*\)/)
    if (logMatch) { tokens.push({ type: 'log', value: logMatch[1], line: i }); i++; continue }

    if (/setTimeout\s*\(/.test(trimmed)) {
      const block = readBlock(i)
      const delayMatch = block.body.match(/,\s*(\d+)\s*\)?\s*;?\s*$/m)
      const delay = delayMatch ? parseInt(delayMatch[1]) : 0
      const inner = extractInner(block.body)
      const cleanInner = inner.replace(/\s*},?\s*\d*\s*\)?\s*;?\s*$/, '').trim()
      tokens.push({ type: 'setTimeout', delay, body: cleanInner, line: i })
      i = block.endLine + 1; continue
    }

    if (/Promise\.res\w*\(\)\.then\s*\(/.test(trimmed) || /queueMicrotask\s*\(/.test(trimmed)) {
      const block = readBlock(i)
      const inner = extractInner(block.body)
      const cleanInner = inner.replace(/\s*}\s*\)?\s*;?\s*$/, '').trim()
      tokens.push({ type: 'promise', body: cleanInner, line: i })
      i = block.endLine + 1; continue
    }

    if (/requestAnimationFrame\s*\(/.test(trimmed)) {
      const block = readBlock(i)
      const inner = extractInner(block.body)
      const cleanInner = inner.replace(/\s*}\s*\)?\s*;?\s*$/, '').trim()
      tokens.push({ type: 'raf', body: cleanInner, line: i })
      i = block.endLine + 1; continue
    }

    if (/fetch\s*\(/.test(trimmed)) {
      const block = readBlock(i)
      tokens.push({ type: 'fetch', line: i })
      i = block.endLine + 1; continue
    }

    i++
  }
  return tokens
}

function simulate(code: string): SimStep[] {
  const steps: SimStep[] = []
  const macroQ: { label: string; body: string }[] = []
  const microQ: { label: string; body: string }[] = []
  const rafQ: { label: string; body: string }[] = []
  const output: string[] = []

  function getLabel(body: string, fallback: string) {
    const m = body.match(/console\.log\(\s*["'`](.+?)["'`]\s*\)/)
    return m ? m[1] : fallback
  }

  function snap(title: string, desc: string, callStack: string[], highlight: Phase, codeLine: number) {
    steps.push({
      title, desc,
      callStack: [...callStack],
      microQueue: microQ.map(m => `Promise \u2192 "${m.label}"`),
      macroQueue: macroQ.map(m => `setTimeout \u2192 "${m.label}"`),
      rafQueue: rafQ.map(m => `rAF \u2192 "${m.label}"`),
      output: [...output],
      highlight, codeLine,
    })
  }

  function execSync(codeBlock: string, context: string) {
    const tokens = tokenize(codeBlock)
    for (const tok of tokens) {
      if (tok.type === 'log') {
        output.push(`"${tok.value}"`)
        snap(
          `console.log("${tok.value}")`,
          (context ? context + ': ' : '') + '\u0421\u0438\u043d\u0445\u0440\u043e\u043d\u043d\u044b\u0439 \u0432\u044b\u0437\u043e\u0432 \u2192 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u043d\u0435\u043c\u0435\u0434\u043b\u0435\u043d\u043d\u043e \u2192 Console.',
          [`console.log("${tok.value}")`], 'callstack', tok.line,
        )
      } else if (tok.type === 'setTimeout') {
        const label = getLabel(tok.body ?? '', 'timeout')
        macroQ.push({ label, body: tok.body ?? '' })
        snap(
          `setTimeout(cb, ${tok.delay}) \u2192 Web API`,
          `\u0422\u0430\u0439\u043c\u0435\u0440 \u043f\u0435\u0440\u0435\u0434\u0430\u0451\u0442\u0441\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0443. \u0427\u0435\u0440\u0435\u0437 ${tok.delay}\u043c\u0441 \u043a\u043e\u043b\u0431\u044d\u043a \u2192 Macrotask Queue.`,
          [`setTimeout(cb, ${tok.delay})`], 'webapi', tok.line,
        )
      } else if (tok.type === 'promise') {
        const label = getLabel(tok.body ?? '', 'promise')
        microQ.push({ label, body: tok.body ?? '' })
        snap(
          'Promise.then \u2192 Microtask Queue',
          'Promise.resolve() \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u043d\u043e, .then() \u043a\u043e\u043b\u0431\u044d\u043a \u2192 Microtask Queue.',
          ['Promise.resolve().then(cb)'], 'micro', tok.line,
        )
      } else if (tok.type === 'raf') {
        const label = getLabel(tok.body ?? '', 'rAF')
        rafQ.push({ label, body: tok.body ?? '' })
        snap('rAF \u2192 Render phase', 'rAF \u043a\u043e\u043b\u0431\u044d\u043a \u0431\u0443\u0434\u0435\u0442 \u0432\u044b\u0437\u0432\u0430\u043d \u043f\u0435\u0440\u0435\u0434 \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u043e\u0439.', ['requestAnimationFrame(cb)'], 'render', tok.line)
      }
    }
  }

  function drainMicro() {
    while (microQ.length > 0) {
      const task = microQ.shift()!
      snap(
        `\u041c\u0438\u043a\u0440\u043e\u0442\u0430\u0441\u043a\u0430: "${task.label}"`,
        '\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u043c\u0438\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0430. \u0415\u0441\u043b\u0438 \u0432\u043d\u0443\u0442\u0440\u0438 \u0435\u0441\u0442\u044c \u043d\u043e\u0432\u044b\u0435 async-\u0432\u044b\u0437\u043e\u0432\u044b \u2014 \u043e\u043d\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u044e\u0442\u0441\u044f.',
        [`Promise cb \u2192 "${task.label}"`], 'micro', -1,
      )
      if (task.body) execSync(task.body, `\u0412\u043d\u0443\u0442\u0440\u0438 \u043c\u0438\u043a\u0440\u043e\u0442\u0430\u0441\u043a\u0438 "${task.label}"`)
    }
  }

  // Фаза 1: основной скрипт
  snap('\u0417\u0430\u043f\u0443\u0441\u043a \u0441\u043a\u0440\u0438\u043f\u0442\u0430', '\u0412\u0435\u0441\u044c \u0441\u043a\u0440\u0438\u043f\u0442 \u2014 \u043f\u0435\u0440\u0432\u0430\u044f \u043c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0430. \u0414\u0432\u0438\u0436\u043e\u043a \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442 \u043a\u043e\u0434 \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043d\u0438\u0437.', ['<script>'], 'callstack', 0)
  execSync(code, '')

  // Фаза 2: синхронный код завершён
  snap('\u0421\u0438\u043d\u0445\u0440\u043e\u043d\u043d\u044b\u0439 \u043a\u043e\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d', 'Call Stack \u043f\u0443\u0441\u0442. Event Loop \u2192 Microtask Queue.', [], 'eventloop', -1)

  // Фаза 3: микрозадачи
  drainMicro()

  // Фаза 4: рендеринг
  if (rafQ.length > 0) {
    while (rafQ.length > 0) {
      const raf = rafQ.shift()!
      snap(`Rendering: rAF "${raf.label}"`, 'requestAnimationFrame \u043a\u043e\u043b\u0431\u044d\u043a \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u043f\u0435\u0440\u0435\u0434 \u043e\u0442\u0440\u0438\u0441\u043e\u0432\u043a\u043e\u0439.', [`rAF cb \u2192 "${raf.label}"`], 'render', -1)
      if (raf.body) execSync(raf.body, '\u0412\u043d\u0443\u0442\u0440\u0438 rAF')
      drainMicro()
    }
  } else {
    snap('\u0420\u0435\u043d\u0434\u0435\u0440\u0438\u043d\u0433 (\u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430)', '\u0411\u0440\u0430\u0443\u0437\u0435\u0440: \u043d\u0443\u0436\u043d\u0430 \u043b\u0438 \u043f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u043a\u0430? rAF \u2192 Style \u2192 Layout \u2192 Paint \u2192 Composite.', [], 'render', -1)
  }

  // Фаза 5: макрозадачи
  while (macroQ.length > 0) {
    const task = macroQ.shift()!
    snap(
      `\u041c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0430: "${task.label}"`,
      'Event Loop \u0431\u0435\u0440\u0451\u0442 \u041e\u0414\u041d\u0423 \u043c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0443 \u0438\u0437 \u043e\u0447\u0435\u0440\u0435\u0434\u0438.',
      [`setTimeout cb \u2192 "${task.label}"`], 'macro', -1,
    )
    if (task.body) execSync(task.body, `\u0412\u043d\u0443\u0442\u0440\u0438 \u043c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0438 "${task.label}"`)
    if (microQ.length > 0) {
      snap('\u041c\u0438\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0438 \u043f\u043e\u0441\u043b\u0435 \u043c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0438', '\u041f\u043e\u0441\u043b\u0435 \u043a\u0430\u0436\u0434\u043e\u0439 \u043c\u0430\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0438 \u2014 \u0441\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u0441\u0435 \u043c\u0438\u043a\u0440\u043e\u0437\u0430\u0434\u0430\u0447\u0438.', [], 'eventloop', -1)
      drainMicro()
    }
  }

  snap('\u0426\u0438\u043a\u043b \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d', '\u0412\u0441\u0435 \u043e\u0447\u0435\u0440\u0435\u0434\u0438 \u043f\u0443\u0441\u0442\u044b. Event Loop \u0436\u0434\u0451\u0442 \u043d\u043e\u0432\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439.', [], 'eventloop', -1)
  return steps
}

/* ═══════════════════════════════════════════════════════════
   Пресеты
   ═══════════════════════════════════════════════════════════ */

const PRESETS = [
  {
    name: '\u0411\u0430\u0437\u043e\u0432\u044b\u0439',
    code: 'console.log("1")\nsetTimeout(() => {\n  console.log("timeout")\n}, 0)\nPromise.resolve().then(() => {\n  console.log("promise")\n})\nconsole.log("2")',
  },
  {
    name: '\u0412\u043b\u043e\u0436\u0435\u043d\u043d\u044b\u0439 Promise',
    code: 'console.log("1")\nsetTimeout(() => {\n  console.log("timeout")\n}, 0)\nPromise.resolve().then(() => {\n  console.log("promise")\n  Promise.resolve().then(() => {\n    setTimeout(() => {\n      console.log("timeout 1")\n    }, 0)\n  })\n})\nconsole.log("2")',
  },
  {
    name: '\u041c\u0438\u043a\u0440\u043e \u0432 \u043c\u0438\u043a\u0440\u043e',
    code: 'console.log("start")\nPromise.resolve().then(() => {\n  console.log("micro 1")\n  Promise.resolve().then(() => {\n    console.log("micro 2")\n    Promise.resolve().then(() => {\n      console.log("micro 3")\n    })\n  })\n})\nsetTimeout(() => {\n  console.log("macro")\n}, 0)\nconsole.log("end")',
  },
  {
    name: '\u0412\u0441\u0451 \u0432\u043c\u0435\u0441\u0442\u0435',
    code: 'console.log("start")\nsetTimeout(() => {\n  console.log("timeout 1")\n}, 0)\nsetTimeout(() => {\n  console.log("timeout 2")\n}, 0)\nPromise.resolve().then(() => {\n  console.log("promise 1")\n})\nPromise.resolve().then(() => {\n  console.log("promise 2")\n})\nconsole.log("end")',
  },
]

/* ═══════════════════════════════════════════════════════════
   Цвета фаз
   ═══════════════════════════════════════════════════════════ */

const phaseColors: Record<Phase, { border: string; text: string; glow: string }> = {
  callstack: { border: '#e94560', text: '#e94560', glow: 'rgba(233,69,96,0.10)' },
  webapi: { border: '#f5a623', text: '#f5a623', glow: 'rgba(245,166,35,0.10)' },
  micro: { border: '#50fa7b', text: '#50fa7b', glow: 'rgba(80,250,123,0.10)' },
  macro: { border: '#bd93f9', text: '#bd93f9', glow: 'rgba(189,147,249,0.10)' },
  render: { border: '#8be9fd', text: '#8be9fd', glow: 'rgba(139,233,253,0.10)' },
  eventloop: { border: '#ffb86c', text: '#ffb86c', glow: 'rgba(255,184,108,0.10)' },
}

/* ═══════════════════════════════════════════════════════════
   Состояние
   ═══════════════════════════════════════════════════════════ */

const code = ref(PRESETS[0].code)
const steps = ref<SimStep[]>(simulate(PRESETS[0].code))
const step = ref(0)
const playing = ref(false)
const mode = ref<'edit' | 'viz'>('viz')
const error = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const cur = computed(() => steps.value[step.value] ?? steps.value[0])
const hc = computed(() => phaseColors[cur.value.highlight] ?? phaseColors.callstack)
const codeLines = computed(() => code.value.split('\n'))

function run() {
  try {
    const s = simulate(code.value)
    if (s.length < 2) { error.value = '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0440\u0430\u0441\u043f\u0430\u0440\u0441\u0438\u0442\u044c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c \u0441\u0438\u043d\u0442\u0430\u043a\u0441\u0438\u0441.'; return }
    error.value = ''
    steps.value = s
    step.value = 0
    mode.value = 'viz'
    playing.value = false
  } catch (e: unknown) {
    error.value = '\u041e\u0448\u0438\u0431\u043a\u0430: ' + (e instanceof Error ? e.message : String(e))
  }
}

function loadPreset(preset: typeof PRESETS[number]) {
  code.value = preset.code
  try {
    steps.value = simulate(preset.code)
    step.value = 0
    playing.value = false
    mode.value = 'viz'
    error.value = ''
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function togglePlay() {
  playing.value = !playing.value
}

function prev() { step.value = Math.max(0, step.value - 1) }
function next() { step.value = Math.min(steps.value.length - 1, step.value + 1) }
function goToStart() { step.value = 0; playing.value = false }
function goToStep(i: number) { step.value = i; playing.value = false }

watch(playing, (isPlaying) => {
  if (timer) { clearInterval(timer); timer = null }
  if (isPlaying) {
    timer = setInterval(() => {
      if (step.value >= steps.value.length - 1) {
        playing.value = false
      } else {
        step.value++
      }
    }, 5000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <!-- style attribute изолирует от .book-prose (unlayered CSS перебивает @layer utilities) -->
  <div
    class="my-6 overflow-hidden rounded-xl"
    style="background: #08081a; color: #ddd; font-size: 14px; line-height: 1.4; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; border: 1px solid rgba(255,255,255,0.08); max-width: none;"
  >
    <!-- Заголовок -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 0;">
      <div>
        <div style="font-size: 17px; font-weight: 700; color: #fff; margin: 0;">
          <span style="color: #50fa7b;">&#9654;</span> Event Loop Simulator
        </div>
        <div style="margin-top: 2px; font-size: 10px; color: rgba(255,255,255,0.25);">
          Напиши JS → пошаговая визуализация
        </div>
      </div>
      <div style="display: flex; gap: 6px;">
        <button
          style="cursor: pointer; border-radius: 6px; padding: 4px 10px; font-size: 10px; font-weight: 600; transition: all 0.2s;"
          :style="mode === 'edit'
            ? { border: '1px solid rgba(80,250,123,0.25)', background: 'rgba(80,250,123,0.12)', color: '#50fa7b' }
            : { border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }"
          @click="mode = 'edit'; playing = false"
        >
          &#10000; Код
        </button>
        <button
          style="cursor: pointer; border-radius: 6px; padding: 4px 10px; font-size: 10px; font-weight: 600; transition: all 0.2s;"
          :style="mode === 'viz'
            ? { border: '1px solid rgba(189,147,249,0.25)', background: 'rgba(189,147,249,0.12)', color: '#bd93f9' }
            : { border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }"
          @click="mode === 'edit' ? run() : null"
        >
          &#9654; Визуализация
        </button>
      </div>
    </div>

    <!-- Пресеты -->
    <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 16px 0;">
      <button
        v-for="preset in PRESETS"
        :key="preset.name"
        style="cursor: pointer; border-radius: 5px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); padding: 3px 10px; font-size: 10px; color: rgba(255,255,255,0.5); transition: background 0.2s;"
        @click="loadPreset(preset)"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Режим редактирования -->
    <div v-if="mode === 'edit'" style="display: flex; flex-direction: column; gap: 10px; padding: 16px;">
      <div style="font-size: 10px; line-height: 1.6; color: rgba(255,255,255,0.35);">
        <span style="color: #50fa7b;">console.log</span> ·
        <span style="color: #bd93f9;">setTimeout</span> ·
        <span style="color: #50fa7b;">Promise.resolve().then</span> ·
        <span style="color: #8be9fd;">requestAnimationFrame</span>
        — вложенность поддерживается!
      </div>
      <textarea
        v-model="code"
        spellcheck="false"
        style="min-height: 200px; resize: none; border-radius: 9px; border: 1.5px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); padding: 12px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.7; color: #e0e0e0; outline: none;"
      />
      <div
        v-if="error"
        style="border-radius: 6px; background: rgba(233,69,96,0.1); padding: 6px 10px; font-size: 11px; color: #e94560;"
      >
        {{ error }}
      </div>
      <button
        style="cursor: pointer; border-radius: 9px; border: 1.5px solid rgba(80,250,123,0.25); background: linear-gradient(135deg, rgba(80,250,123,0.12), rgba(189,147,249,0.12)); padding: 11px; font-size: 13px; font-weight: 700; color: #50fa7b;"
        @click="run"
      >
        &#9654; Запустить симуляцию
      </button>
    </div>

    <!-- Режим визуализации -->
    <div v-else style="display: flex; flex-direction: column; gap: 8px; overflow: auto; padding: 10px 14px 0;">
      <!-- Описание шага -->
      <div
        style="border-radius: 9px; border-width: 1.5px; border-style: solid; padding: 10px 12px; transition: all 0.3s;"
        :style="{
          background: hc.glow,
          borderColor: hc.border + '45',
        }"
      >
        <div style="font-size: 12px; font-weight: 700;" :style="{ color: hc.text }">
          {{ cur.title }}
        </div>
        <div style="margin-top: 4px; font-size: 11px; line-height: 1.5; color: rgba(255,255,255,0.6);">
          {{ cur.desc }}
        </div>
      </div>

      <!-- Код с подсветкой строки -->
      <div style="max-height: 240px; overflow: auto; border-radius: 7px; border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.015); padding: 6px 0;">
        <div
          v-for="(line, i) in codeLines"
          :key="i"
          style="padding: 1px 10px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 10.5px; line-height: 1.6; transition: all 0.25s; white-space: pre;"
          :style="cur.codeLine === i
            ? { background: hc.border + '15', borderLeft: '2.5px solid ' + hc.border, color: hc.text }
            : { borderLeft: '2.5px solid transparent', color: 'rgba(255,255,255,0.25)' }"
        >
          <span style="color: rgba(255,255,255,0.10); margin-right: 7px; font-size: 9px;">{{ String(i + 1).padStart(2, ' ') }}</span>{{ line || '\u00A0' }}
        </div>
      </div>

      <!-- Очереди: 2×2 сетка -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px;">
        <!-- Call Stack -->
        <div
          style="min-height: 58px; border-radius: 9px; border-width: 1.5px; border-style: solid; padding: 9px 10px; transition: all 0.3s;"
          :style="{
            background: cur.highlight === 'callstack' ? phaseColors.callstack.glow : 'rgba(255,255,255,0.012)',
            borderColor: cur.highlight === 'callstack' ? phaseColors.callstack.border : 'rgba(255,255,255,0.055)',
            transform: cur.highlight === 'callstack' ? 'scale(1.012)' : 'scale(1)',
          }"
        >
          <div
            style="margin-bottom: 6px; display: flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;"
            :style="{ color: cur.highlight === 'callstack' ? phaseColors.callstack.text : 'rgba(255,255,255,0.25)' }"
          >
            <span style="font-size: 11px;">&#128229;</span>Call Stack
            <span
              v-if="cur.callStack.length"
              style="margin-left: auto; border-radius: 4px; padding: 1px 5px; font-size: 9px; font-weight: 800;"
              :style="{ background: phaseColors.callstack.border + '25', color: phaseColors.callstack.text }"
            >
              {{ cur.callStack.length }}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div
              v-if="!cur.callStack.length"
              style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-style: italic; color: rgba(255,255,255,0.10);"
            >
              пусто
            </div>
            <div
              v-for="(item, idx) in cur.callStack"
              :key="idx"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 4px; padding: 3px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px;"
              :style="{
                background: phaseColors.callstack.border + '12',
                border: '1px solid ' + phaseColors.callstack.border + '28',
                color: phaseColors.callstack.text,
              }"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Web APIs -->
        <div
          style="min-height: 58px; border-radius: 9px; border-width: 1.5px; border-style: solid; padding: 9px 10px; transition: all 0.3s;"
          :style="{
            background: cur.highlight === 'webapi' ? phaseColors.webapi.glow : 'rgba(255,255,255,0.012)',
            borderColor: cur.highlight === 'webapi' ? phaseColors.webapi.border : 'rgba(255,255,255,0.055)',
            transform: cur.highlight === 'webapi' ? 'scale(1.012)' : 'scale(1)',
          }"
        >
          <div
            style="margin-bottom: 6px; display: flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;"
            :style="{ color: cur.highlight === 'webapi' ? phaseColors.webapi.text : 'rgba(255,255,255,0.25)' }"
          >
            <span style="font-size: 11px;">&#127760;</span>Web APIs
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div
              v-if="cur.highlight !== 'webapi' || !cur.macroQueue.length"
              style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-style: italic; color: rgba(255,255,255,0.10);"
            >
              пусто
            </div>
            <template v-else>
              <div
                v-for="(item, idx) in cur.macroQueue"
                :key="idx"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 4px; padding: 3px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px;"
                :style="{
                  background: phaseColors.webapi.border + '12',
                  border: '1px solid ' + phaseColors.webapi.border + '28',
                  color: phaseColors.webapi.text,
                }"
              >
                {{ item }}
              </div>
            </template>
          </div>
        </div>

        <!-- Microtask Queue -->
        <div
          style="min-height: 58px; border-radius: 9px; border-width: 1.5px; border-style: solid; padding: 9px 10px; transition: all 0.3s;"
          :style="{
            background: cur.highlight === 'micro' ? phaseColors.micro.glow : 'rgba(255,255,255,0.012)',
            borderColor: cur.highlight === 'micro' ? phaseColors.micro.border : 'rgba(255,255,255,0.055)',
            transform: cur.highlight === 'micro' ? 'scale(1.012)' : 'scale(1)',
          }"
        >
          <div
            style="margin-bottom: 6px; display: flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;"
            :style="{ color: cur.highlight === 'micro' ? phaseColors.micro.text : 'rgba(255,255,255,0.25)' }"
          >
            <span style="font-size: 11px;">&#9889;</span>Microtask Queue
            <span
              v-if="cur.microQueue.length"
              style="margin-left: auto; border-radius: 4px; padding: 1px 5px; font-size: 9px; font-weight: 800;"
              :style="{ background: phaseColors.micro.border + '25', color: phaseColors.micro.text }"
            >
              {{ cur.microQueue.length }}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div
              v-if="!cur.microQueue.length"
              style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-style: italic; color: rgba(255,255,255,0.10);"
            >
              пусто
            </div>
            <div
              v-for="(item, idx) in cur.microQueue"
              :key="idx"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 4px; padding: 3px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px;"
              :style="{
                background: phaseColors.micro.border + '12',
                border: '1px solid ' + phaseColors.micro.border + '28',
                color: phaseColors.micro.text,
              }"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Macrotask Queue -->
        <div
          style="min-height: 58px; border-radius: 9px; border-width: 1.5px; border-style: solid; padding: 9px 10px; transition: all 0.3s;"
          :style="{
            background: cur.highlight === 'macro' ? phaseColors.macro.glow : 'rgba(255,255,255,0.012)',
            borderColor: cur.highlight === 'macro' ? phaseColors.macro.border : 'rgba(255,255,255,0.055)',
            transform: cur.highlight === 'macro' ? 'scale(1.012)' : 'scale(1)',
          }"
        >
          <div
            style="margin-bottom: 6px; display: flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;"
            :style="{ color: cur.highlight === 'macro' ? phaseColors.macro.text : 'rgba(255,255,255,0.25)' }"
          >
            <span style="font-size: 11px;">&#128230;</span>Macrotask Queue
            <span
              v-if="cur.macroQueue.length"
              style="margin-left: auto; border-radius: 4px; padding: 1px 5px; font-size: 9px; font-weight: 800;"
              :style="{ background: phaseColors.macro.border + '25', color: phaseColors.macro.text }"
            >
              {{ cur.macroQueue.length }}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div
              v-if="!cur.macroQueue.length"
              style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-style: italic; color: rgba(255,255,255,0.10);"
            >
              пусто
            </div>
            <div
              v-for="(item, idx) in cur.macroQueue"
              :key="idx"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 4px; padding: 3px 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px;"
              :style="{
                background: phaseColors.macro.border + '12',
                border: '1px solid ' + phaseColors.macro.border + '28',
                color: phaseColors.macro.text,
              }"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Rendering -->
      <div
        style="display: flex; align-items: center; gap: 7px; border-radius: 7px; border-width: 1px; border-style: solid; padding: 6px 10px; transition: all 0.3s;"
        :style="{
          background: cur.highlight === 'render' ? phaseColors.render.glow : 'rgba(255,255,255,0.012)',
          borderColor: cur.highlight === 'render' ? phaseColors.render.border + '50' : 'rgba(255,255,255,0.05)',
        }"
      >
        <span style="font-size: 12px;">&#127912;</span>
        <span
          style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;"
          :style="{ color: cur.highlight === 'render' ? phaseColors.render.text : 'rgba(255,255,255,0.25)' }"
        >
          Rendering
        </span>
        <span style="margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.2);">
          rAF → Style → Layout → Paint
        </span>
      </div>

      <!-- Event Loop -->
      <div
        style="display: flex; align-items: center; gap: 7px; border-radius: 7px; border-width: 1px; border-style: solid; padding: 6px 10px; transition: all 0.3s;"
        :style="{
          background: cur.highlight === 'eventloop' ? phaseColors.eventloop.glow : 'rgba(255,255,255,0.012)',
          borderColor: cur.highlight === 'eventloop' ? phaseColors.eventloop.border + '50' : 'rgba(255,255,255,0.05)',
        }"
      >
        <span style="font-size: 12px;">&#128260;</span>
        <span
          style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;"
          :style="{ color: cur.highlight === 'eventloop' ? phaseColors.eventloop.text : 'rgba(255,255,255,0.25)' }"
        >
          Event Loop
        </span>
        <span style="margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.2);">
          {{ cur.highlight === 'eventloop' ? 'проверяю очереди...' : 'наблюдаю' }}
        </span>
      </div>

      <!-- Console -->
      <div style="border-radius: 7px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); padding: 7px 10px;">
        <div style="margin-bottom: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.18);">
          Console
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 5px; min-height: 18px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <span
            v-if="!cur.output.length"
            style="font-size: 10px; font-style: italic; color: rgba(255,255,255,0.08);"
          >
            ожидание...
          </span>
          <span
            v-for="(item, idx) in cur.output"
            :key="idx"
            style="color: #50fa7b; background: rgba(80,250,123,0.07); padding: 2px 6px; border-radius: 3px;"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <!-- Навигация -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 4px 0;">
        <button
          style="cursor: pointer; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.04); padding: 6px 10px; font-size: 11px; color: rgba(255,255,255,0.5);"
          @click="goToStart"
        >
          &#9198;
        </button>
        <button
          style="border-radius: 6px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.04); padding: 6px 12px; font-size: 11px; font-weight: 600;"
          :style="{ color: step === 0 ? 'rgba(255,255,255,0.1)' : '#ddd', cursor: step === 0 ? 'default' : 'pointer' }"
          :disabled="step === 0"
          @click="prev"
        >
          &#8592;
        </button>
        <button
          style="cursor: pointer; border-radius: 6px; padding: 6px 16px; font-size: 11px; font-weight: 700;"
          :style="playing
            ? { border: '1px solid rgba(233,69,96,0.25)', background: 'rgba(233,69,96,0.10)', color: '#e94560' }
            : { border: '1px solid rgba(80,250,123,0.25)', background: 'rgba(80,250,123,0.10)', color: '#50fa7b' }"
          @click="togglePlay"
        >
          {{ playing ? '&#9208; Пауза' : '&#9654; Авто' }}
        </button>
        <button
          style="border-radius: 6px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.04); padding: 6px 12px; font-size: 11px; font-weight: 600;"
          :style="{ color: step === steps.length - 1 ? 'rgba(255,255,255,0.1)' : '#ddd', cursor: step === steps.length - 1 ? 'default' : 'pointer' }"
          :disabled="step === steps.length - 1"
          @click="next"
        >
          &#8594;
        </button>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.2);">
          {{ step + 1 }}/{{ steps.length }}
        </span>
      </div>

      <!-- Точки шагов -->
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3px; padding-bottom: 10px;">
        <div
          v-for="(s, i) in steps"
          :key="i"
          style="cursor: pointer; border-radius: 3px; transition: all 0.2s;"
          :style="{
            width: i === step ? '16px' : '6px',
            height: '6px',
            background: i === step
              ? (phaseColors[s.highlight]?.border ?? phaseColors.callstack.border)
              : (phaseColors[s.highlight]?.border ?? phaseColors.callstack.border) + '25',
          }"
          @click="goToStep(i)"
        />
      </div>
    </div>
  </div>
</template>

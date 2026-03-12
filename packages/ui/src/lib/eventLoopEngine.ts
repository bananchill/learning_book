/* ═══════════════════════════════════════════════════════════
   Движок Event Loop Simulator — чистые функции
   ═══════════════════════════════════════════════════════════ */

export interface Token {
  type: 'log' | 'setTimeout' | 'promise' | 'raf' | 'fetch'
  value?: string
  delay?: number
  body?: string
  line: number
}

export interface SimStep {
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

export type Phase = 'callstack' | 'webapi' | 'micro' | 'macro' | 'render' | 'eventloop'

/* ─── Парсер ─── */

export function tokenize(code: string): Token[] {
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

/* ─── Симуляция ─── */

export function simulate(code: string): SimStep[] {
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

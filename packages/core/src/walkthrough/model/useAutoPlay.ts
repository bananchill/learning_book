import { ref, onUnmounted } from 'vue'

// Авто-воспроизведение шагов с настраиваемой скоростью
export function useAutoPlay(onTick: () => void, intervalMs = 3000) {
  const isPlaying = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function play() {
    if (isPlaying.value) return
    isPlaying.value = true
    timer = setInterval(() => {
      onTick()
    }, intervalMs)
  }

  function pause() {
    isPlaying.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function toggle() {
    isPlaying.value ? pause() : play()
  }

  onUnmounted(pause)

  return { isPlaying, play, pause, toggle }
}

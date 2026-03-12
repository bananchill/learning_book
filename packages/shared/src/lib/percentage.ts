/** Процент value от total, округлённый до целого. При total=0 возвращает 0. */
export function calcPercent(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((value / total) * 100)
}

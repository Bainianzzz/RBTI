export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('无法从空数组中随机取值')
  }
  return items[Math.floor(Math.random() * items.length)]!
}

export function arrayToObjectKeys<T extends string>(arr: T[]) {
  return arr.reduce(
    (acc, curr) => ((acc[curr] = false), acc),
    {} as Record<T, boolean>,
  )
}

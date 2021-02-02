export function unixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000)
}

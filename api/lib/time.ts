export function unixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000)
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

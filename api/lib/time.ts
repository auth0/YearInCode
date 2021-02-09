export function getWeekNumber(date: Date) {
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(
    (((date as any) - (yearStart as any)) / 86400000 + 1) / 7,
  )

  return weekNo
}

export function unixTimestampToDate(timestamp: number) {
  return new Date(timestamp * 1000)
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

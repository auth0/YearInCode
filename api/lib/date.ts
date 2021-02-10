export function getWeekNumber(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

export function unixTimestampToDate(timestamp: number) {
  const date = new Date(timestamp * 1000)
  date.setHours(0, 0, 0, 0)

  return date
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

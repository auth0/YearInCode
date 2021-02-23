import getISOWeek from 'date-fns/getISOWeek'

export function getWeekNumber(date: Date, dowOffset = 0) {
  const weekNumber = getISOWeek(date)

  return weekNumber === 53 ? 52 : weekNumber
}

export function unixTimestampToDate(timestamp: number) {
  const date = new Date(timestamp * 1000)

  return date
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

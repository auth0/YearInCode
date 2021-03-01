import {getISOWeek, fromUnixTime, getUnixTime} from 'date-fns'

export function getWeekNumber(date: Date) {
  const weekNumber = getISOWeek(date)

  return weekNumber === 53 ? 52 : weekNumber
}

export function unixTimestampToDate(timestamp: number) {
  const date = fromUnixTime(timestamp)

  return date
}

export function dateToUnixTimeStamp(date: Date) {
  return getUnixTime(date)
}

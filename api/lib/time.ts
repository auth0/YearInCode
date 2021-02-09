import dayjs from 'dayjs'

export function unixTimestampToDate(timestamp: number) {
  return dayjs.unix(timestamp)
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @param Date date
 * @return int
 */
export function getWeekNumber(date: Date, dowOffset = 4) {
  const newYear = new Date(date.getFullYear(), 0, 1)
  let day = newYear.getDay() - dowOffset
  day = day >= 0 ? day : day + 7

  const daynum =
    Math.floor(
      (date.getTime() -
        newYear.getTime() -
        (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000,
    ) + 1

  let weeknum

  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1
    if (weeknum > 52) {
      const nYear = new Date(date.getFullYear() + 1, 0, 1)
      let nday = nYear.getDay() - dowOffset
      nday = nday >= 0 ? nday : nday + 7

      weeknum = nday < 4 ? 1 : 53
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7)
  }

  return weeknum
}

export function unixTimestampToDate(timestamp: number) {
  const date = new Date(timestamp * 1000)

  return date
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

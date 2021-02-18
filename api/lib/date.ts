/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @param Date date
 * @return int
 */
export function getWeekNumber(date: Date, dowOffset = 0) {
  const newYear = new Date(date.getFullYear(), 0, 1)
  let day = newYear.getDay() - dowOffset
  day = day >= 0 ? day : day + 7

  const SIXTY_SECONDS = 60000
  const ONE_HOUR = 86400000
  const dayNumber =
    Math.floor(
      (date.getTime() -
        newYear.getTime() -
        (date.getTimezoneOffset() - newYear.getTimezoneOffset()) *
          SIXTY_SECONDS) /
        ONE_HOUR,
    ) + 1

  let weekNumber

  if (day < 4) {
    weekNumber = Math.floor((dayNumber + day - 1) / 7) + 1
    if (weekNumber > 52) {
      weekNumber = 52
    }
  } else {
    weekNumber = Math.floor((dayNumber + day - 1) / 7)
  }

  return weekNumber
}

export function unixTimestampToDate(timestamp: number) {
  const date = new Date(timestamp * 1000)

  return date
}

export function dateToUnixTimeStamp(date: Date) {
  return new Date(date).getTime() / 1000
}

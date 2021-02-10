import * as date from '../date'

describe('date.getWeekNumber', () => {
  it('should display 1 with first week of january', () => {
    const firstWeekOfJan = new Date('03 January 2020')
    expect(date.getWeekNumber(firstWeekOfJan)).toBe(1)
  })
})

describe('date.unixTimestampToDate', () => {
  it('should convert a unix timestamp to date', () => {
    const firstWeekOfJan = new Date('03 January 2020')
    const timestamp = firstWeekOfJan.getTime() / 1000
    expect(date.unixTimestampToDate(timestamp).toISOString()).toEqual(
      firstWeekOfJan.toISOString(),
    )
  })
})

describe('date.dateToUnixTimeStamp', () => {
  it('should convert a unix timestamp to date', () => {
    const firstWeekOfJan = new Date('03 January 2020')
    const timestamp = firstWeekOfJan.getTime() / 1000
    expect(date.dateToUnixTimeStamp(firstWeekOfJan)).toEqual(timestamp)
  })
})

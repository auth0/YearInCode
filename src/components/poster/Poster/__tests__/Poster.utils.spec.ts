import faker from 'faker'

import * as posterUtils from '../Poster.utils'

describe('posterUtils.genPoints', () => {
  describe('When number of points is provided', () => {
    it('should generate points in 360 degrees', () => {
      expect(posterUtils.genPoints(5, 20)).toEqual([
        {x: 0, y: 20},
        {x: 19.02113032590307, y: 6.180339887498949},
        {x: 11.755705045849465, y: -16.180339887498945},
        {x: -11.75570504584946, y: -16.18033988749895},
        {x: -19.021130325903073, y: 6.180339887498945},
      ])
    })
  })

  describe('when length of points is not provided', () => {
    it('should return an empty array when length is not provided', () => {
      expect(posterUtils.genPoints(0, 20)).toEqual([])
    })
  })
})

describe('posterUtils.separateNumber', () => {
  it('should separate number', () => {
    expect(posterUtils.separateNumber(1000)).toEqual('1 000')
  })

  it('should separate number with given separator', () => {
    expect(posterUtils.separateNumber(1000, ',')).toEqual('1,000')
  })
})

describe('posterUtils.numberOrZero', () => {
  it('should return 0 when number is undefined', () => {
    expect(posterUtils.numberOrZero(undefined)).toBe(0)
  })

  it("should return number if it's not undefined", () => {
    const number = faker.random.number()
    expect(posterUtils.numberOrZero(number)).toBe(number)
  })
})

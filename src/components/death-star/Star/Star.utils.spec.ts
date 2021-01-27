import {genPoints, indexOfMax} from './Star.utils'

describe('Star utils', () => {
  it('should get index of max number in array', () => {
    const array = [10, 50, 12, 3, 23, 57]
    expect(indexOfMax(array)).toBe(array.length - 1)
  })

  it('should generate points in 360 degrees', () => {
    expect(genPoints(5, 20)).toEqual([
      {x: 0, y: 20},
      {x: 19.02113032590307, y: 6.180339887498949},
      {x: 11.755705045849465, y: -16.180339887498945},
      {x: -11.75570504584946, y: -16.18033988749895},
      {x: -19.021130325903073, y: 6.180339887498945},
    ])
  })
})

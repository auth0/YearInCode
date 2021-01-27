import {indexOfMax} from './Star.utils'

describe('Star utils', () => {
  it.only('should get index of max number in array', () => {
    const array = [10, 50, 12, 3, 23, 57]
    expect(indexOfMax(array)).toBe(array.length - 1)
  })
})

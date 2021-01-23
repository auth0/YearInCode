import {Star} from '@nebula/types/death-star'

export function toRadians(deg: number) {
  return deg * (Math.PI / 180)
}

export function toDegrees(rad: number) {
  return rad * (180 / Math.PI)
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1
  }

  var max = arr[0]
  var maxIndex = 0

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i
      max = arr[i]
    }
  }

  return maxIndex
}

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getRandomLanguage() {
  return ['JavaScript', 'CSS', 'HTML'][getRandomArbitrary(0, 3)]
}

export function getMockData(): Star {
  const schema = {
    name: 'Robert',
    year: 2020,
    followers: 22,
    dominantLanguage: '',
    weeks: [] as Star['weeks'],
  }

  const WEEK_AMOUNT = 52
  const languageCount: Record<string, number> = {}

  const weeks: Star['weeks'] = new Array(WEEK_AMOUNT)
    .fill(undefined)
    .map((_, i) => {
      const commits = getRandomArbitrary(1, 50)
      const lines = getRandomArbitrary(1, 100)
      const dominantLanguage = getRandomLanguage()

      if (!languageCount[dominantLanguage]) languageCount[dominantLanguage] = 1
      else languageCount[dominantLanguage] += 1

      return {
        week: i + 1,
        commits,
        lines,
        dominantLanguage,
        total: commits + lines,
      }
    })

  schema.weeks = weeks
  schema.dominantLanguage = Object.keys(languageCount)[
    indexOfMax(Object.values(languageCount))
  ]

  return schema
}

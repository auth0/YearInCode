import {Star} from '@nebula/types/death-star'

export const commitColors = new Proxy(
  {
    Python: '#CF4744',
    JavaScript: '#1368F8',
    Java: '#884DF0',
    'Objective-C': '#9D6F0D',
    'C#': '#B04EA9',
    TypeScript: '#388659',
  },
  {
    get: function (target, name) {
      return target.hasOwnProperty(name) ? target[name] : '#AA3C1F'
    },
  },
)

export const linesColors = new Proxy(
  {
    Python: '#EC5E5E',
    JavaScript: '#0078FF',
    Java: '#9F6EFF',
    'Objective-C': '#E7B130',
    'C#': '#db85d1',
    TypeScript: '#3DAF6B',
  },
  {
    get: function (target, name) {
      return target.hasOwnProperty(name) ? target[name] : '#EB5424'
    },
  },
)

export function toRadians(deg: number) {
  return deg * (Math.PI / 180)
}

export function genPoints(length: number, radius: number) {
  const step = (Math.PI * 2) / length

  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }))
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
  return ['JavaScript', 'TypeScript', 'Objective-C', 'Perl', 'Java', 'Python'][
    getRandomArbitrary(0, 6)
  ]
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

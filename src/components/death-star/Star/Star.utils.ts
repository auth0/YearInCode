import {Star} from '@nebula/types/death-star'

export const commitColors = new Proxy(
  {
    Python: '#001FBC',
    JavaScript: '#9D6F0D',
    Java: '#a54f00',
    'Objective-C': '#1368F8',
    'C#': '#388659',
    TypeScript: '#0b7a9a',
    PHP: '#884DF0',
    Ruby: '#C7504B',
  },
  {
    get: function (target, name) {
      return target.hasOwnProperty(name) ? target[name] : '#AA3C1F'
    },
  },
)

export const linesColors = new Proxy(
  {
    Python: '#0025E4',
    JavaScript: '#E7B130',
    Java: '#D16909',
    'Objective-C': '#0078FF',
    'C#': '#3DAF6B',
    TypeScript: '#1396BB',
    PHP: '#9F6EFF',
    Ruby: '#E46764',
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

export function indexOfMax(arr) {
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

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getRandomLanguage() {
  const languages = Object.keys(commitColors)
  languages.push('Perl')

  return languages[getRandomArbitrary(0, languages.length)]
}

function getRandomName() {
  const names = ['Jarod', 'Fernanda', 'David', 'Cynthia', 'Jose', 'Maciej']

  return names[getRandomArbitrary(0, names.length)]
}

export function getMockData(weekAmount = 52): Star {
  const schema = {
    name: getRandomName(),
    year: 2020,
    followers: getRandomArbitrary(5, 25),
    dominantLanguage: '',
    weeks: [] as Star['weeks'],
  }

  const languageCount: Record<string, number> = {}

  const weeks: Star['weeks'] = new Array(weekAmount)
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

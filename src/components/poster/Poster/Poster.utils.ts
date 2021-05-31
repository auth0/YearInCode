import {indexOfMax} from '@nebula/common/array'
import {Poster} from '@nebula/types/poster'

export interface PosterTooltipData {
  index?: number
  week: number
  commits: number
  lines: number
  dominantLanguage: string
  dominantRepository: string
}

export const tooltipVariants = {
  visible: {opacity: 1},
  hidden: {opacity: 0},
}

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
    get: function (target: {[l in string]: string}, name: string) {
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
    get: function (target: {[l in string]: string}, name: string) {
      return target.hasOwnProperty(name) ? target[name] : '#EB5424'
    },
  },
)

export function numberOrZero(n: number | undefined) {
  return n ?? 0
}

export function separateNumber(n: Number, separator = ' ') {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

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

function getRandomRepository() {
  const repositories = [
    'react',
    'vue',
    'next.js',
    'lock',
    'auth0js',
    'auth0-java',
  ]

  return repositories[getRandomArbitrary(0, repositories.length)]
}

export function getMockData(weekAmount = 52): Poster {
  const schema = {
    name: getRandomName(),
    year: 2020,
    followers: getRandomArbitrary(5, 25),
    dominantLanguage: '',
    dominantRepository: '',
    weeks: [] as Poster['weeks'],
    totalLinesOfCode: 0,
  }

  const languageCount: Record<string, number> = {}
  const repositoryOverallTotal: Record<string, number> = {}

  const weeks: Poster['weeks'] = new Array(weekAmount)
    .fill(undefined)
    .map((_, i) => {
      const commits = getRandomArbitrary(1, 50)
      const lines = getRandomArbitrary(1, 100)
      const dominantLanguage = getRandomLanguage()
      const dominantRepository = getRandomRepository()

      const total = commits + lines
      schema.totalLinesOfCode += total

      if (!repositoryOverallTotal[dominantRepository])
        repositoryOverallTotal[dominantRepository] = total
      else repositoryOverallTotal[dominantRepository] += total

      if (!languageCount[dominantLanguage]) languageCount[dominantLanguage] = 1
      else languageCount[dominantLanguage] += 1

      return {
        week: i + 1,
        commits,
        lines,
        dominantLanguage,
        dominantRepository,
        total,
      }
    })

  schema.weeks = weeks
  schema.dominantLanguage = Object.keys(languageCount)[
    indexOfMax(Object.values(languageCount))
  ]
  schema.dominantRepository = Object.keys(repositoryOverallTotal)[
    indexOfMax(Object.values(repositoryOverallTotal))
  ]

  return schema
}

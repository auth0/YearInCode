import dayjs from 'dayjs'

import {dateToUnixTimeStamp} from '@api/lib/date'

import * as startUtils from '../start.utils'

describe('startUtils.getWeeksWithDominantLanguageAndRepository', () => {
  it('should add dominant language and repository to incomplete weeks array', () => {
    const incompleteWeeks = [
      ...new Array(16).fill(undefined),
      {week: 17, lines: 44, commits: 7, total: 51},
      ...new Array(9).fill(undefined),
      {week: 27, lines: 127, commits: 6, total: 133},
      ...new Array(25).fill(undefined),
    ]
    const repositoryWeeklyTotal = {
      '16': {TEST_REPO_1: 25, TEST_REPO_3: 26},
      '26': {TEST_REPO_2: 133},
    }
    const repositoryLanguages = {
      TEST_REPO_1: 'Python',
      TEST_REPO_2: 'JavaScript',
      TEST_REPO_3: 'Ruby',
    }

    const result = startUtils.getWeeksWithDominantLanguageAndRepository(
      incompleteWeeks,
      repositoryWeeklyTotal,
      repositoryLanguages,
    )

    expect(result).toEqual([
      ...new Array(16).fill(undefined),
      {
        week: 17,
        lines: 44,
        commits: 7,
        total: 51,
        dominantLanguage: 'Ruby',
        dominantRepository: 'TEST_REPO_3',
      },
      ...new Array(9).fill(undefined),
      {
        week: 27,
        lines: 127,
        commits: 6,
        total: 133,
        dominantLanguage: 'JavaScript',
        dominantRepository: 'TEST_REPO_2',
      },
      ...new Array(25).fill(undefined),
    ])
  })
})

describe('startUtils.getGeneralWeekActivity', () => {
  it('should return general week activity', async () => {
    const repositoriesStats: startUtils.RepositoryStatistic[] = [
      {
        repository: 'TEST_REPO_1',
        language: 'Python',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 2)
                .startOf('day')
                .set('year', 2020)
                .set('month', 3)
                .toDate(),
            ).toString(),
            a: 12,
            d: 77,
            c: 2,
          },
        ],
      },
      {
        repository: 'TEST_REPO_2',
        language: 'JavaScript',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 12)
                .startOf('day')
                .set('year', 2020)
                .set('month', 6)
                .toDate(),
            ).toString(),
            a: 50,
            d: 77,
            c: 6,
          },
        ],
      },
    ]
    const year = 2020

    const {
      totalLinesOfCode,
      repositoryWeeklyTotal,
      repositoryLanguages,
      repositoryOverallTotal,
      languageCount,
      incompleteWeeks,
    } = await startUtils.getGeneralWeekActivity(repositoriesStats, year)

    expect(totalLinesOfCode).toBe(216)
    expect(repositoryWeeklyTotal).toEqual({
      '16': {TEST_REPO_1: 91},
      '26': {TEST_REPO_2: 133},
    })
    expect(repositoryLanguages).toEqual({
      TEST_REPO_1: 'Python',
      TEST_REPO_2: 'JavaScript',
    })
    expect(repositoryOverallTotal).toEqual({TEST_REPO_1: 91, TEST_REPO_2: 133})
    expect(languageCount).toEqual({Python: 1, JavaScript: 1})
    expect(incompleteWeeks).toEqual([
      ...new Array(16).fill(undefined),
      {week: 17, lines: 89, commits: 2, total: 91},
      ...new Array(9).fill(undefined),
      {week: 27, lines: 127, commits: 6, total: 133},
      ...new Array(25).fill(undefined),
    ])
  })

  it('should exclude stat on different year', async () => {
    const repositoriesStats: startUtils.RepositoryStatistic[] = [
      {
        repository: 'TEST_REPO_1',
        language: 'Python',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 2)
                .startOf('day')
                .set('year', 2020)
                .set('month', 3)
                .toDate(),
            ).toString(),
            a: 12,
            d: 77,
            c: 2,
          },
        ],
      },
      {
        repository: 'TEST_REPO_2',
        language: 'JavaScript',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 12)
                .startOf('day')
                .set('year', 2019)
                .set('month', 6)
                .toDate(),
            ).toString(),
            a: 50,
            d: 77,
            c: 6,
          },
        ],
      },
    ]

    const year = 2020

    const {
      totalLinesOfCode,
      repositoryWeeklyTotal,
      repositoryLanguages,
      repositoryOverallTotal,
      languageCount,
      incompleteWeeks,
    } = await startUtils.getGeneralWeekActivity(repositoriesStats, year)

    expect(totalLinesOfCode).toBe(89)
    expect(repositoryWeeklyTotal).toEqual({
      '16': {TEST_REPO_1: 91},
    })
    expect(repositoryLanguages).toEqual({
      TEST_REPO_1: 'Python',
    })
    expect(repositoryOverallTotal).toEqual({TEST_REPO_1: 91})
    expect(languageCount).toEqual({Python: 1})
    expect(incompleteWeeks).toEqual([
      ...new Array(16).fill(undefined),
      {week: 17, lines: 89, commits: 2, total: 91},
      ...new Array(35).fill(undefined),
    ])
  })

  it('should exclude item if there are no contributions', async () => {
    const repositoriesStats: startUtils.RepositoryStatistic[] = [
      {
        repository: 'TEST_REPO_1',
        language: 'Python',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 2)
                .startOf('day')
                .set('year', 2020)
                .set('month', 3)
                .toDate(),
            ).toString(),
            a: 0,
            d: 0,
            c: 0,
          },
        ],
      },
    ]
    const year = 2020

    const {
      totalLinesOfCode,
      repositoryWeeklyTotal,
      repositoryLanguages,
      repositoryOverallTotal,
      languageCount,
      incompleteWeeks,
    } = await startUtils.getGeneralWeekActivity(repositoriesStats, year)

    expect(totalLinesOfCode).toEqual(0)
    expect(repositoryWeeklyTotal).toEqual({})
    expect(repositoryLanguages).toEqual({})
    expect(repositoryOverallTotal).toEqual({})
    expect(languageCount).toEqual({})
    expect(incompleteWeeks).toEqual(new Array(52).fill(undefined))
  })

  it('should add total if contributions are on same week', async () => {
    const repositoriesStats: startUtils.RepositoryStatistic[] = [
      {
        repository: 'TEST_REPO_1',
        language: 'Python',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 2)
                .startOf('day')
                .set('year', 2020)
                .set('month', 3)
                .toDate(),
            ).toString(),
            a: 12,
            d: 10,
            c: 3,
          },
        ],
      },
      {
        repository: 'TEST_REPO_2',
        language: 'JavaScript',
        weeks: [
          {
            w: dateToUnixTimeStamp(
              dayjs()
                .set('day', 4)
                .startOf('day')
                .set('year', 2020)
                .set('month', 3)
                .toDate(),
            ).toString(),
            a: 10,
            d: 12,
            c: 4,
          },
        ],
      },
    ]
    const year = 2020

    const {
      totalLinesOfCode,
      repositoryWeeklyTotal,
      repositoryLanguages,
      repositoryOverallTotal,
      languageCount,
      incompleteWeeks,
    } = await startUtils.getGeneralWeekActivity(repositoriesStats, year)

    expect(totalLinesOfCode).toEqual(44)
    expect(repositoryWeeklyTotal).toEqual({
      '16': {TEST_REPO_1: 25, TEST_REPO_2: 26},
    })
    expect(repositoryLanguages).toEqual({
      TEST_REPO_1: 'Python',
      TEST_REPO_2: 'JavaScript',
    })
    expect(repositoryOverallTotal).toEqual({TEST_REPO_1: 25, TEST_REPO_2: 26})
    expect(languageCount).toEqual({Python: 1, JavaScript: 1})
    expect(incompleteWeeks).toEqual([
      ...new Array(16).fill(undefined),
      {week: 17, lines: 44, commits: 7, total: 51},
      ...new Array(35).fill(undefined),
    ])
  })
})

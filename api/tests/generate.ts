import {RestEndpointMethodTypes} from '@octokit/rest'
import dayjs from 'dayjs'
import faker from 'faker'

import {dateToUnixTimeStamp} from '@api/lib/date'

type GitHubAuthenticatedUser = RestEndpointMethodTypes['users']['getAuthenticated']['response']['data']

export function buildAuthenticatedGitHubUser(
  overrides?: Partial<GitHubAuthenticatedUser>,
): Partial<GitHubAuthenticatedUser> {
  return {
    name: 'TEST_USER',
    login: 'MOCK_USER_NAME',
    followers: faker.random.number(50),
    ...overrides,
  }
}

type GitHubRepo = RestEndpointMethodTypes['repos']['get']['response']['data']

export function buildGitHubRepo(
  overrides?: Partial<GitHubRepo>,
): Partial<GitHubRepo> {
  return {
    name: faker.name.jobTitle(),
    owner: {
      login: 'MOCK_USER_NAME',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://api.github.com/users/octocat',
      html_url: 'https://github.com/octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      following_url:
        'https://api.github.com/users/octocat/following{/other_user}',
      gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/octocat/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
      organizations_url: 'https://api.github.com/users/octocat/orgs',
      repos_url: 'https://api.github.com/users/octocat/repos',
      events_url: 'https://api.github.com/users/octocat/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/octocat/received_events',
      type: 'User',
      site_admin: false,
    },
    language: 'JavaScript',
    ...overrides,
  }
}

type GitHubContributorStat = RestEndpointMethodTypes['repos']['getContributorsStats']['response']['data'][0]

export function buildContributorStats(
  overrides?: Partial<GitHubContributorStat>,
): Partial<GitHubContributorStat> {
  return {
    total: 3,
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
      {
        w: dateToUnixTimeStamp(
          dayjs()
            .set('day', 18)
            .startOf('day')
            .set('year', 2020)
            .set('month', 7)
            .toDate(),
        ).toString(),
        a: 700,
        d: 77,
        c: 4,
      },
    ],
    author: {
      login: 'MOCK_USER_NAME',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://api.github.com/users/octocat',
      html_url: 'https://github.com/octocat',
      followers_url: 'https://api.github.com/users/octocat/followers',
      following_url:
        'https://api.github.com/users/octocat/following{/other_user}',
      gists_url: 'https://api.github.com/users/octocat/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/octocat/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/octocat/subscriptions',
      organizations_url: 'https://api.github.com/users/octocat/orgs',
      repos_url: 'https://api.github.com/users/octocat/repos',
      events_url: 'https://api.github.com/users/octocat/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/octocat/received_events',
      type: 'User',
      site_admin: false,
    },
    ...overrides,
  }
}

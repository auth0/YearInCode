import faker from 'faker'
import {RestEndpointMethodTypes} from '@octokit/rest'

import {UserProfile} from '@lib/auth'

export function buildUserProfile(
  overrides?: Partial<UserProfile>,
): UserProfile {
  return {
    name: faker.internet.userName(),
    nickname: faker.name.firstName(),
    picture: '',
    sub: '',
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  }
}

type GitHubAuthenticatedUser = RestEndpointMethodTypes['users']['getAuthenticated']['response']['data']

export function buildAuthenticatedGitHubUser(
  overrides?: Partial<GitHubAuthenticatedUser>,
): Partial<GitHubAuthenticatedUser> {
  return {
    name: 'TEST_USER',
    login: 'TEST_USER',
    followers: 38,
    ...overrides,
  }
}

type GitHubRepo = RestEndpointMethodTypes['repos']['get']['response']['data']

export function buildGitHubRepo(
  overrides?: Partial<GitHubRepo>,
): Partial<GitHubRepo> {
  return {
    name: 'TEST_USER',
    owner: {
      login: 'TEST_USER',
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

type GitHubContributorStats = RestEndpointMethodTypes['repos']['getContributorsStats']['response']['data']

export function buildContributorStats(
  overrides?: Partial<GitHubContributorStats>,
): Partial<GitHubContributorStats> {
  return [
    {
      total: 3,
      weeks: [
        {
          w: '1367712000',
          a: 12,
          d: 77,
          c: 2,
        },
        {
          w: '1367712500',
          a: 50,
          d: 77,
          c: 6,
        },
        {
          w: '1367716000',
          a: 700,
          d: 77,
          c: 4,
        },
      ],
      author: {
        login: 'TEST_USER',
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
    },
  ]
}

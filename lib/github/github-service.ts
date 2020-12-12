import {Octokit} from '@octokit/rest'

import {client} from '@lib/api'

class GitHubServiceImplementation {
  _client: Octokit

  constructor() {
    this._client = new Octokit({
      baseUrl: 'https://api.github.com',
    })
  }

  public async getUserRepositories(key: string, {userId}: {userId: string}) {
    const {data} = await client.post(`/github/repositories`, {userId})

    return data
  }
}

export const GitHubService = new GitHubServiceImplementation()

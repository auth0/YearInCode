import {Octokit} from '@octokit/rest'

import {client} from '@lib/api'

class GitHubServiceImplementation {
  private _client: Octokit
  private _token: string

  constructor() {
    this.getUserRepositories = this.getUserRepositories.bind(this)
  }

  private async getToken(userId: string) {
    const {data} = await client.get<{token: string}>(`/github/token/${userId}`)

    this._token = data.token
  }

  private async getClient(userId: string) {
    if (!this._token) await this.getToken(userId)

    this._client = new Octokit({
      auth: this._token,
    })
  }

  public async getUserRepositories(_key: string, {userId}: {userId: string}) {
    if (!this._client) await this.getClient(userId)

    // TODO: handle logic
    // For now, more context with design is required before proceeding to do any calculations
    const repos = await this._client.repos.listForAuthenticatedUser()
    console.log({repos})

    return {}
  }
}

export const GitHubService = new GitHubServiceImplementation()

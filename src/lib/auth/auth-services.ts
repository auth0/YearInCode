import {client} from '@lib/api'

import {UserProfile} from './auth-types'

class AuthServiceImplementation {
  public async fetchUser() {
    const {data} = await client.get<UserProfile>('/me')

    return data
  }
}

export const AuthService = new AuthServiceImplementation()

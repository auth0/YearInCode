import faker from 'faker'

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

import {Year} from '@nebula/types/queue'

export function getRandomString() {
  return ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
}

export function generatePosterSlug(username: string, year: Year) {
  return `${username.toLowerCase()}-poster-${year}-${getRandomString()}`
}

import {Document} from 'dynamoose/dist/Document'

import {Year} from './queue'

export interface PosterWeek {
  week: number
  commits: number
  lines: number
  total: number
  dominantLanguage: string
  dominantRepository: string
}
export interface Poster {
  name: string
  year: number
  followers: number
  dominantLanguage: string
  dominantRepository: string
  totalLinesOfCode: number
  weeks: PosterWeek[]
}

export enum PosterSteps {
  FAILED = 'FAILED',
  PREPARING = 'PREPARING',
  START = 'START_QUEUE',
  GATHERING = 'GATHERING_INFO',
  LAST_TOUCHES = 'LAST_TOUCHES',
  READY = 'READY',
}

export interface PosterImageSizes {
  instagram: string
  twitter: string
  openGraph: string
  highQualityPoster: string
}

export interface PosterState {
  userId: string
  year: Year
  step: PosterSteps
  posterSlug: string
  posterData: string
  posterImages: PosterImageSizes
}

export interface PosterDocument extends Document, PosterState {
  updatedAt: Date
}

export interface ConnectionDocument extends Document {
  userId: string
  connectionId: string
}

export interface PosterStatusResponse {
  posters: Pick<PosterState, 'step' | 'posterSlug' | 'year'>[]
}

export interface PosterSlugResponse {
  year: Year
  userId: string
  posterData: string
  posterImages: PosterState['posterImages']
  otherPosters: Pick<PosterState, 'posterSlug' | 'year'>[]
}

export interface PosterStatusDTO {
  userId: string
}

export interface WebSocketConnectDTO {
  wsPayload: string
}

export interface UnsealedWebSocketConnectDTO {
  accessToken: string
  userId: string
}

export interface GetPostersDTO {
  userId: string
}

export interface GetBySlugDTO {
  slug: string
}

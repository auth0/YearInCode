import {Document} from 'dynamoose/dist/Document'

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

export interface PosterState {
  userId: string
  step: PosterSteps
  posterSlug: string
  posterData: string
}

export interface PosterDocument extends Document, PosterState {}

export interface ConnectionDocument extends Document {
  userId: string
  connectionId: string
}

export interface PosterStatusResponse {
  status: Pick<PosterState, 'step' | 'posterSlug'>
}

export interface PosterSlugResponse {
  posterData: string
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

export interface GetStatusDTO {
  userId: string
}

export interface GetBySlugDTO {
  slug: string
}

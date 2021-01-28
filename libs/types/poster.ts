import {Document} from 'dynamoose/dist/Document'

export interface PosterWeek {
  week: number
  commits: number
  lines: number
  dominantLanguage: string
  total: number
}
export interface Star {
  name: string
  year: number
  followers: number
  dominantLanguage: string
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
}

export interface PosterDocument extends Document, PosterState {}

export interface ConnectionDocument extends Document {
  userId: string
  connectionId: string
}

export interface PosterStatusResponse {
  status: Pick<PosterState, 'step'>
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

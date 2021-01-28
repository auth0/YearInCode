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

export enum PosterUserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface PosterState {
  userId: string
  step: PosterSteps
  connectionId: string
  connectionStatus: PosterUserStatus
}

export interface PosterDocument extends Document, PosterState {}

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

import {Document} from 'dynamoose/dist/Document'

export interface StarWeek {
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
  weeks: StarWeek[]
}

export enum DeathStarSteps {
  FAILED = 'FAILED',
  PREPARING = 'PREPARING',
  START = 'START_QUEUE',
  GATHERING = 'GATHERING_INFO',
  LAST_TOUCHES = 'LAST_TOUCHES',
  READY = 'READY',
}

export enum DeathStarUserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface DeathStarState {
  userId: string
  step: DeathStarSteps
  connectionId: string
  connectionStatus: DeathStarUserStatus
}

export interface DeathStarDocument extends Document, DeathStarState {}

export interface DeathStarStatusResponse {
  status: Pick<DeathStarState, 'step'>
}
export interface DeathStarStatusDTO {
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

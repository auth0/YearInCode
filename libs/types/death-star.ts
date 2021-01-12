import {Document} from 'dynamoose/dist/Document'

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

export interface WebsocketConnectDTO {
  accessToken: string
  userId: string
}

export interface GetStatusDTO {
  userId: string
}

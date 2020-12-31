export type Years = Array<'2017' | '2018' | '2019' | '2020'>

export interface QueueDTO {
  userId: string
  years: Years
}

export interface QueueResponse {
  message: string
}

export type Year = 2017 | 2018 | 2019 | 2020

export interface QueueDTO {
  userId: string
  username: string
  year: Year
}

export interface QueueRecordDTO extends QueueDTO {
  posterSlug: string
}

export interface QueueResponse {
  message: string
}

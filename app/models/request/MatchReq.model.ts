import type { genderEnum } from '../enums/User.enum'

export interface IJoinTheRandomMatchQueuePayload {
  gender: genderEnum | null
  minAge: number
  maxAge: number
}

export interface ISendASessionMessagePayload {
  text: string
}

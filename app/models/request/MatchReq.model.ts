import type { genderQueryEnum } from '../enums/User.enum'

export interface IJoinTheRandomMatchQueuePayload {
  gender: genderQueryEnum
  minAge: number
  maxAge: number
}

export interface ISendASessionMessagePayload {
  text: string
}

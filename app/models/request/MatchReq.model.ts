import type { genderEnum } from '../enums/User.enum'

export interface IJoinTheRandomMatchQueuePayload {
  gender: genderEnum
  minAge: number
  maxAge: number
}

import type { CallStatusEnum } from '../enums/Call.enum'
import type { IApiResponse } from './Response.model'

export interface IInitiateCallData {
  id: number
  callerId: number
  calleeId: number
  status: CallStatusEnum
  startedAt: string | null // ปกติวันที่จะถูกเก็บเป็น ISO String
  endedAt: string | null
  durationSec: number
  createdAt: string | null
  callerUsername: string
  callerNickname: string
  callerProfileImg: string
  calleeUsername: string
  calleeNickname: string
  calleeProfileImg: string
}


export type IInitiateCallResponse = IApiResponse<IInitiateCallData>

export enum CallEvent {
  CALL_INCOMING = 'call:incoming',
  CALL_ACCEPTED = 'call:accepted',
  CALL_REJECTED = 'call:rejected',
  CALL_ENDED = 'call:ended',
  CALL_MISSED = 'call:missed',
  CALL_OFFER = 'call:offer',
  CALL_ANSWER = 'call:answer',
  CALL_ICE_CANDIDATE = 'call:ice-candidate',
  CALL_ERROR = 'call:error'
}

export enum CallStatusEnum {
  RINGING = 'RINGING',
  ACCEPTED = 'ACCEPTED',
  ENDED = 'ENDED',
  MISSED = 'MISSED'
}

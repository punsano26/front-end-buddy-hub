export enum RentStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  COMPLETING = 'COMPLETING',
  EXPIRED = 'EXPIRED'
}

export enum AttachmentsTypeEnum {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
  FILE = 'FILE'
}

export enum RentEvent {
  HIRE_REQUESTED = 'hire_requested',
  HIRE_ACCEPTED = 'hire_accepted',
  HIRE_REJECTED = 'hire_rejected',
  HIRE_CANCELLED = 'hire_cancelled'
}

export enum RentSessionsEvent {
  SESSION_STARTED = 'session_started',
  SESSION_EXPIRED = 'session_expired',
  SESSION_COMPLETED = 'session_completed',
  SESSION_COMPLETING = 'session_completing',
  SESSION_COMPLETING_EXPIRED = 'session_completing_expired',
  SERVICE_NEW_MESSAGE = 'service_new_message',
  SERVICE_MESSAGE_UPDATED = 'service_message_updated',
  SERVICE_MESSAGE_DELETED = 'service_message_deleted',
  SERVICE_MESSAGE_READ = 'service_message_read'
}


export enum ISortAverageRatingEnum {
  HIGHEST = 'highest',
  LOWEST = 'lowest'
}

export enum StatusActiveEnum {
  ALL = 'all',
  ONLINE = 'online',
  OFFLINE = 'offline'
}

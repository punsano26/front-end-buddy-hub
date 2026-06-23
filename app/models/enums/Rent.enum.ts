export enum RentStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
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
  SERVICE_NEW_MESSAGE = 'service_new_message',
  SERVICE_MESSAGE_UPDATED = 'service_message_updated',
  SERVICE_MESSAGE_DELETED = 'service_message_deleted',
  SERVICE_MESSAGE_READ = 'service_message_read'
}

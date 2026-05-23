import { defineStore } from 'pinia'
import type { MatchEvent } from '~/models/enums/Match.enum'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ISendASessionMessagePayload } from '~/models/request/MatchReq.model'
import type { ISendASessionMessageData } from '~/models/response/MatchRes.model'
import MatchProvider from '~/resource/provider/Match.provider'
import { useAuthStore } from './Auth'

export interface IMatchSocketEvent {
  event: MatchEvent
  data: unknown
  receivedAt: string
}

export interface IMatchMessageEntry {
  id: number | string
  senderId?: number
  text: string
  sendAt: string
  isOwn: boolean
}

interface IMatchState {
  lastEvent: IMatchSocketEvent | null
  lastEventByType: Partial<Record<MatchEvent, IMatchSocketEvent>>
  events: IMatchSocketEvent[]
  sessionMessages: IMatchMessageEntry[]
}

const MAX_EVENTS = 50

function isRecord (value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function tryGetTimeMs (value: string): number | null {
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : null
}

function toSessionId (value: unknown): TBaseParamsId {
  if (Array.isArray(value)) {
    return toSessionId(value[0])
  }

  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && Number.isFinite(value)) return value

  return undefined
}

interface ISessionMessageLike {
  id: number | string
  text: string
  sendAt?: string
  createdAt?: string
  senderId?: number
  isOwn?: boolean
}

function isSessionMessageLike (value: unknown): value is ISessionMessageLike {
  if (!isRecord(value)) return false
  const id = value.id
  const sendAt = (value as Record<string, unknown>).sendAt
  const createdAt = (value as Record<string, unknown>).createdAt

  return (typeof id === 'number' || typeof id === 'string')
    && typeof value.text === 'string'
    && (typeof sendAt === 'string' || typeof createdAt === 'string')
}

function normalizeSessionMessage (message: ISessionMessageLike): ISendASessionMessageData {
  const sendAt = typeof message.sendAt === 'string'
    ? message.sendAt
    : typeof message.createdAt === 'string'
      ? message.createdAt
      : new Date().toISOString()

  return {
    id: message.id,
    text: message.text,
    sendAt,
    senderId: message.senderId,
    isOwn: message.isOwn
  }
}

export function extractSessionMessageFromSocket (value: unknown): ISendASessionMessageData | null {
  if (isSessionMessageLike(value)) return normalizeSessionMessage(value)
  if (!isRecord(value)) return null

  const directMessage = (value as Record<string, unknown>).message
  if (isSessionMessageLike(directMessage)) return normalizeSessionMessage(directMessage)

  const directData = (value as Record<string, unknown>).data
  if (isSessionMessageLike(directData)) return normalizeSessionMessage(directData)

  return null
}

export function findPartnerIdFromAnywhere (value: unknown, currentUserId?: number): number | null {
  if (!value || typeof value !== 'object') return null
  const data = value as any

  // 1. Direct fields: partnerId, friendId, requesterId, receiverId, senderId, userId
  const directFields = ['partnerId', 'friendId', 'requesterId', 'receiverId', 'senderId', 'userId']
  for (const field of directFields) {
    const val = data[field]
    if (typeof val === 'number' && val !== currentUserId) {
      return val
    }
  }

  // 2. Arrays: e.g. users array, userIds array
  if (Array.isArray(data.users)) {
    for (const u of data.users) {
      if (u && typeof u === 'object') {
        const id = u.id || u.userId
        if (typeof id === 'number' && id !== currentUserId) {
          return id
        }
      } else if (typeof u === 'number' && u !== currentUserId) {
        return u
      }
    }
  }

  if (Array.isArray(data.userIds)) {
    const id = data.userIds.find((u: unknown): boolean => typeof u === 'number' && u !== currentUserId)
    if (typeof id === 'number') return id
  }

  // 3. Nested objects: session, user, partner, requester, receiver, sender
  const nestedObjects = ['session', 'user', 'partner', 'requester', 'receiver', 'sender']
  for (const objName of nestedObjects) {
    const nested = data[objName]
    if (nested && typeof nested === 'object') {
      const id = findPartnerIdFromAnywhere(nested, currentUserId)
      if (id !== null) return id
    }
  }

  return null
}

export function getSessionIdFromEvent (value: unknown): TBaseParamsId {
  if (!isRecord(value)) return undefined

  const directSessionId = toSessionId(value.sessionId)
  if (directSessionId) return directSessionId

  const directId = toSessionId(value.id)
  if (directId) return directId

  const session = isRecord(value.session) ? value.session : null
  if (!session) return undefined

  return toSessionId(session.sessionId) ?? toSessionId(session.id)
}

export const useMatchStore = defineStore('Match', {
  state: (): IMatchState => ({
    lastEvent: null,
    lastEventByType: {},
    events: [],
    sessionMessages: []
  }),

  getters: {
    getLastEventByType: (state: IMatchState): ((event: MatchEvent) => IMatchSocketEvent | null) => {
      return (event: MatchEvent): IMatchSocketEvent | null => state.lastEventByType[event] || null
    }
  },

  actions: {
    pushSocketEvent (event: MatchEvent, data: unknown): void {
      const entry: IMatchSocketEvent = {
        event,
        data,
        receivedAt: new Date().toISOString()
      }

      this.lastEvent = entry
      this.lastEventByType = {
        ...this.lastEventByType,
        [event]: entry
      }
      this.events = [entry, ...this.events].slice(0, MAX_EVENTS)
    },

    clearEvents (): void {
      this.lastEvent = null
      this.lastEventByType = {}
      this.events = []
    },

    resetRealtime (): void {
      this.clearEvents()
      this.sessionMessages = []
    },

    async fetchSessionMessages (sessionId: TBaseParamsId): Promise<void> {
      if (!sessionId) return
      const matchService = new MatchProvider()
      const authStore = useAuthStore()
      try {
        const response = await matchService.findAllSessionMessages(sessionId)
        if (response?.data) {
          this.sessionMessages = response.data.map((msg: ISendASessionMessageData): IMatchMessageEntry => ({
            id: msg.id,
            senderId: msg.senderId,
            text: msg.text,
            sendAt: msg.sendAt,
            isOwn: msg.isOwn !== undefined ? msg.isOwn : msg.senderId === authStore.user?.id
          }))
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    },

    async sendSessionMessage (sessionId: TBaseParamsId, payload: ISendASessionMessagePayload): Promise<void> {
      if (!sessionId) return
      const matchService = new MatchProvider()

      // Optimistic update
      const newMessage: IMatchMessageEntry = {
        id: Date.now(),
        text: payload.text,
        sendAt: new Date().toISOString(),
        isOwn: true
      }
      this.sessionMessages.push(newMessage)

      try {
        await matchService.SendASessionMessage(sessionId, payload)
      } catch (error) {
        console.error('Failed to send message:', error)
        // Revert optimistic update on failure
        this.sessionMessages = this.sessionMessages.filter((m: IMatchMessageEntry): boolean => m.id !== newMessage.id)
      }
    },

    upsertRealtimeSessionMessage (message: ISendASessionMessageData, currentUserId: number): void {
      const isOwn = message.isOwn !== undefined
        ? !!message.isOwn
        : message.senderId === currentUserId

      const incoming: IMatchMessageEntry = {
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        sendAt: message.sendAt,
        isOwn
      }

      const existingIndex = this.sessionMessages.findIndex((m: IMatchMessageEntry): boolean => m.id === incoming.id)
      if (existingIndex >= 0) {
        this.sessionMessages[existingIndex] = incoming
        return
      }

      // Replace optimistic message (pre-socket) to avoid duplicates.
      if (incoming.isOwn) {
        const incomingMs = tryGetTimeMs(incoming.sendAt)
        const optimisticIndex = this.sessionMessages
          .map((m: IMatchMessageEntry, index: number): { m: IMatchMessageEntry, index: number } => ({ m, index }))
          .reverse()
          .find(({ m }: { m: IMatchMessageEntry }): boolean => {
            if (!m.isOwn) return false
            if (m.text !== incoming.text) return false

            const optimisticMs = tryGetTimeMs(m.sendAt)
            if (!incomingMs || !optimisticMs) return false

            return Math.abs(incomingMs - optimisticMs) <= 15000
          })
          ?.index

        if (typeof optimisticIndex === 'number' && optimisticIndex >= 0) {
          this.sessionMessages[optimisticIndex] = incoming
          return
        }
      }

      this.sessionMessages.push(incoming)
    }
  }
})

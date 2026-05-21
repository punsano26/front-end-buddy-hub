import { defineStore } from 'pinia'
import type { MatchEvent } from '~/models/enums/Match.enum'

export interface IMatchSocketEvent {
  event: MatchEvent
  data: unknown
  receivedAt: string
}

interface IMatchState {
  lastEvent: IMatchSocketEvent | null
  lastEventByType: Partial<Record<MatchEvent, IMatchSocketEvent>>
  events: IMatchSocketEvent[]
}

const MAX_EVENTS = 50

export const useMatchStore = defineStore('Match', {
  state: (): IMatchState => ({
    lastEvent: null,
    lastEventByType: {},
    events: []
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
    }
  }
})

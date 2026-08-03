import { defineStore } from 'pinia'
import { CallStatusEnum } from '~/models/enums/Call.enum'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IInitiateCallData } from '~/models/response/CallRes.model'
import CallProvider from '~/resource/provider/Call.provider'

interface ICallState {
  callStatus: CallStatusEnum | null
  callData: IInitiateCallData | null
  incomingCallData: IInitiateCallData | null
  remoteOffer: { sdp: { type: string, sdp: string }, senderId: number } | null
  remoteAnswer: { sdp: { type: string, sdp: string }, senderId: number } | null
  remoteIceCandidates: Array<{
    candidate: {
      candidate: string
      sdpMid?: string | null
      sdpMLineIndex?: number | null
    }
    senderId: number
  }>
}

let callChannel: BroadcastChannel | null = null
let endResetTimer: ReturnType<typeof setTimeout> | null = null
let isListenerSet = false

function getCallChannel (): BroadcastChannel | null {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    if (!callChannel) {
      callChannel = new BroadcastChannel('buddyhub_call_state')
    }
    return callChannel
  }
  return null
}

function postCallBroadcast (status: CallStatusEnum | null, data: IInitiateCallData | null): void {
  getCallChannel()?.postMessage({
    type: 'CALL_STATUS_CHANGE',
    status,
    data
  })
}

export const useCallStore = defineStore('Call', {
  state: (): ICallState => ({
    callStatus: null,
    callData: null,
    incomingCallData: null,
    remoteOffer: null,
    remoteAnswer: null,
    remoteIceCandidates: []
  }),

  actions: {
    initBroadcastListener (): void {
      const channel = getCallChannel()
      if (channel && !isListenerSet) {
        isListenerSet = true
        channel.onmessage = (event: MessageEvent): void => {
          const payload = event.data
          if (payload && payload.type === 'CALL_STATUS_CHANGE') {
            this.applyRemoteCallState(payload.status, payload.data)
          }
        }
      }
    },

    setCallStatus (status: CallStatusEnum | null, broadcast: boolean = true): void {
      this.initBroadcastListener()
      this.callStatus = status
      if (
        status === CallStatusEnum.ENDED
        || status === CallStatusEnum.MISSED
      ) {
        this.incomingCallData = null
      }

      if (endResetTimer) {
        clearTimeout(endResetTimer)
        endResetTimer = null
      }

      if (status === CallStatusEnum.ENDED || status === CallStatusEnum.MISSED) {
        endResetTimer = setTimeout((): void => {
          this.resetCallState(false)
        }, 1500)
      }

      if (broadcast && status !== CallStatusEnum.ACCEPTED) {
        postCallBroadcast(this.callStatus, this.callData)
      }
    },

    setCallData (data: IInitiateCallData | null, broadcast: boolean = true): void {
      this.initBroadcastListener()
      this.callData = data
      if (broadcast) {
        postCallBroadcast(this.callStatus, this.callData)
      }
    },

    setIncomingCallData (data: IInitiateCallData | null): void {
      this.initBroadcastListener()
      this.incomingCallData = data
    },

    applyRemoteCallState (status: CallStatusEnum | null, data: IInitiateCallData | null): void {
      this.callStatus = status
      if (data !== undefined) {
        this.callData = data
      }
      if (
        status === CallStatusEnum.ENDED
        || status === CallStatusEnum.MISSED
        || status === null
      ) {
        this.incomingCallData = null
      }

      if (endResetTimer) {
        clearTimeout(endResetTimer)
        endResetTimer = null
      }

      if (status === CallStatusEnum.ENDED || status === CallStatusEnum.MISSED) {
        endResetTimer = setTimeout((): void => {
          this.resetCallState(false)
        }, 1500)
      } else if (status === null && this.callStatus !== null) {
        this.resetCallState(false)
      }
    },

    setRemoteOffer (offer: { sdp: { type: string, sdp: string }, senderId: number } | null): void {
      this.remoteOffer = offer
    },

    setRemoteAnswer (answer: { sdp: { type: string, sdp: string }, senderId: number } | null): void {
      this.remoteAnswer = answer
    },

    addRemoteIceCandidate (candidate: {
      candidate: {
        candidate: string
        sdpMid?: string | null
        sdpMLineIndex?: number | null
      }
      senderId: number
    }): void {
      this.remoteIceCandidates.push(candidate)
    },

    async initiateCall (id: TBaseParamsId): Promise<void> {
      if (import.meta.client) {
        const { $wsConnect } = useNuxtApp() as any
        if (typeof $wsConnect === 'function') {
          $wsConnect()
        }
      }
      this.initBroadcastListener()
      const callsService = new CallProvider()
      const response = await callsService.InitiateCall(id)
      if (response?.data) {
        this.callData = response.data
        this.setCallStatus(CallStatusEnum.RINGING)
      }
    },

    async acceptIncomingCall (id: TBaseParamsId): Promise<void> {
      this.initBroadcastListener()
      const callsService = new CallProvider()
      const response = await callsService.AcceptIncomingCall(id)
      if (response?.data) {
        this.callData = response.data
        this.setCallStatus(CallStatusEnum.ACCEPTED)
        this.incomingCallData = null
      }
    },

    async rejectIncomingCall (id: TBaseParamsId): Promise<void> {
      this.initBroadcastListener()
      const callsService = new CallProvider()
      try {
        await callsService.RejectIncomingCall(id)
      } catch (err: any) {
        console.error('[CallStore] RejectIncomingCall error:', err)
      }
      this.resetCallState()
    },

    async endCall (id: TBaseParamsId): Promise<void> {
      this.initBroadcastListener()
      const callsService = new CallProvider()
      try {
        await callsService.EndCall(id)
      } catch (err: any) {
        console.error('[CallStore] EndCall error:', err)
      }
      this.callData = null
      this.setCallStatus(CallStatusEnum.ENDED)
    },

    resetCallState (broadcast: boolean = true): void {
      if (endResetTimer) {
        clearTimeout(endResetTimer)
        endResetTimer = null
      }
      this.callStatus = null
      this.callData = null
      this.incomingCallData = null
      this.remoteOffer = null
      this.remoteAnswer = null
      this.remoteIceCandidates = []
      if (broadcast) {
        postCallBroadcast(null, null)
      }
    }
  }
})

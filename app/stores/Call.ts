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
    setCallStatus (status: CallStatusEnum | null): void {
      this.callStatus = status
      if (
        status === CallStatusEnum.ACCEPTED
        || status === CallStatusEnum.ENDED
        || status === CallStatusEnum.MISSED
      ) {
        this.incomingCallData = null
      }
    },

    setCallData (data: IInitiateCallData | null): void {
      this.callData = data
    },

    setIncomingCallData (data: IInitiateCallData | null): void {
      this.incomingCallData = data
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
      const callsService = new CallProvider()
      const response = await callsService.InitiateCall(id)
      if (response?.data) {
        this.callData = response.data
        this.callStatus = CallStatusEnum.RINGING
      }
    },

    async acceptIncomingCall (id: TBaseParamsId): Promise<void> {
      const callsService = new CallProvider()
      const response = await callsService.AcceptIncomingCall(id)
      if (response?.data) {
        this.callData = response.data
        this.callStatus = CallStatusEnum.ACCEPTED
        this.incomingCallData = null
      }
    },

    async rejectIncomingCall (id: TBaseParamsId): Promise<void> {
      const callsService = new CallProvider()
      await callsService.RejectIncomingCall(id)
      this.resetCallState()
    },

    async endCall (id: TBaseParamsId): Promise<void> {
      const callsService = new CallProvider()
      await callsService.EndCall(id)
      this.callStatus = CallStatusEnum.ENDED
      this.callData = null
      this.incomingCallData = null
      this.remoteOffer = null
      this.remoteAnswer = null
      this.remoteIceCandidates = []
    },

    resetCallState (): void {
      this.callStatus = null
      this.callData = null
      this.incomingCallData = null
      this.remoteOffer = null
      this.remoteAnswer = null
      this.remoteIceCandidates = []
    }
  }
})

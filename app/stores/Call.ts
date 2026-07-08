import { defineStore } from 'pinia'
import { CallStatusEnum } from '~/models/enums/Call.enum'
import type { IInitiateCallData } from '~/models/response/CallRes.model'
import CallProvider from '~/resource/provider/Call.provider'
import type { TBaseParamsId } from '~/models/request/Request.model'

interface ICallState {
  callStatus: CallStatusEnum | null
  callData: IInitiateCallData | null
  incomingCallData: IInitiateCallData | null
}

export const useCallStore = defineStore('Call', {
  state: (): ICallState => ({
    callStatus: null,
    callData: null,
    incomingCallData: null
  }),

  actions: {
    setCallStatus (status: CallStatusEnum | null): void {
      this.callStatus = status
    },

    setCallData (data: IInitiateCallData | null): void {
      this.callData = data
    },

    setIncomingCallData (data: IInitiateCallData | null): void {
      this.incomingCallData = data
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
      }
    },

    async rejectIncomingCall (id: TBaseParamsId): Promise<void> {
      const callsService = new CallProvider()
      await callsService.RejectIncomingCall(id)
      this.callStatus = null
      this.callData = null
      this.incomingCallData = null
    },

    async endCall (id: TBaseParamsId): Promise<void> {
      const callsService = new CallProvider()
      await callsService.EndCall(id)
      this.callStatus = CallStatusEnum.ENDED
      this.callData = null
      this.incomingCallData = null
    },

    resetCallState (): void {
      this.callStatus = null
      this.callData = null
      this.incomingCallData = null
    }
  }
})

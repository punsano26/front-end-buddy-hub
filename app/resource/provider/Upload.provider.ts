import HttpRequest from '../HttpRequest'
import type { IUploadPayload } from '~/models/request/UploadReq.model'
import type { ICreateUploadResponse } from '~/models/response/UploadRes.model'

export interface IUploadProvider {
  onUpload (payload: IUploadPayload): Promise<ICreateUploadResponse>
}

class UploadProvider extends HttpRequest implements IUploadProvider {
  private urlPrefix: string = '/uploads'

  public async onUpload (payload: IUploadPayload): Promise<ICreateUploadResponse> {
    this.setUserAuthHeader()
    const form = new FormData()
    const fileList = Array.isArray(payload.files) ? payload.files : [payload.files]

    fileList.forEach((file: File): void => {
      form.append('files', file)
    })

    form.append('category', payload.category)

    if (typeof payload.partnerId === 'number') {
      form.append('partnerId', String(payload.partnerId))
    }

    const response = await this.post(`${this.urlPrefix}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}

export default UploadProvider

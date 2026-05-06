import HttpRequest from '../HttpRequest'
import type { IUploadPayload } from '~/models/request/UploadReq.model'
import type { ICreateUploadResponse } from '~/models/response/๊UploadRes.model'

export interface IUploadProvider {
  onUpload (payload: IUploadPayload): Promise<ICreateUploadResponse>
}

class UploadProvider extends HttpRequest implements IUploadProvider {
  private urlPrefix: string = '/upload'

  public async onUpload (payload: IUploadPayload): Promise<ICreateUploadResponse> {
    this.setUserAuthHeader()
    const form = new FormData()
    form.append('file', payload.file)
    if (payload?.category) form.append('category', payload.category)
    const response = await this.post(`${this.urlPrefix}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}

export default UploadProvider

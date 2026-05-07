import type { UploadCategoryEnum } from '../enums/Upload.enum'

export interface IUploadPayload {
  category: UploadCategoryEnum
  files: File | File[]
  partnerId?: number
}

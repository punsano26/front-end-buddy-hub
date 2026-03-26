import type { UploadCategoryEnum } from '../enums/Upload.enum'

export interface IUploadPayload {
  file: File
  category?: UploadCategoryEnum
}

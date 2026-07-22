import type { IBaseOptions } from '../Global.model'

export enum AttachmentTypeEnum {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
  FILE = 'FILE'
}

export const AttachmentTypeOptions: IBaseOptions<AttachmentTypeEnum>[] = [
  {
    label: 'รูปภาพ',
    value: AttachmentTypeEnum.IMAGE
  },
  {
    label: 'วิดีโอ',
    value: AttachmentTypeEnum.VIDEO
  },
  {
    label: 'GIF',
    value: AttachmentTypeEnum.GIF
  },
  {
    label: 'ไฟล์',
    value: AttachmentTypeEnum.FILE
  }
] as const

export type AttachmentType = keyof typeof AttachmentTypeEnum

export const AttachmentTypeMap: Record<AttachmentType, string> = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  GIF: 'GIF',
  FILE: 'FILE'
}

export function toAttachmentTypeEnum (value?: string): AttachmentTypeEnum | undefined {
  if (!value) return undefined
  const upperValue = value.toUpperCase()
  if (upperValue === AttachmentTypeEnum.IMAGE) return AttachmentTypeEnum.IMAGE
  if (upperValue === AttachmentTypeEnum.VIDEO) return AttachmentTypeEnum.VIDEO
  if (upperValue === AttachmentTypeEnum.GIF) return AttachmentTypeEnum.GIF
  if (upperValue === AttachmentTypeEnum.FILE) return AttachmentTypeEnum.FILE
  return undefined
}

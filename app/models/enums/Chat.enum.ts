import type { IBaseOptions } from '../Global.model'

// 1. Enum Definition
export enum chatEnum {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
  START_CALL = 'START_CALL',
  END_CALL = 'END_CALL',
  MISSED_CALL = 'MISSED_CALL',
  COIN_GRANTED = 'COIN_GRANTED'
}

export const ChatEnum = chatEnum

// 2. Options List for Selects / Dropdowns
export const ChatOptions: IBaseOptions<chatEnum>[] = [
  {
    label: 'ข้อความ',
    value: chatEnum.TEXT
  },
  {
    label: 'มีเดีย',
    value: chatEnum.MEDIA
  },
  {
    label: 'เริ่มการโทร',
    value: chatEnum.START_CALL
  },
  {
    label: 'สิ้นสุดการโทร',
    value: chatEnum.END_CALL
  },
  {
    label: 'ไม่ได้รับสาย',
    value: chatEnum.MISSED_CALL
  },
  {
    label: 'ส่งมอบคอยน์',
    value: chatEnum.COIN_GRANTED
  }
] as const

// 3. Key Type Alias
export type ChatType = keyof typeof chatEnum

// 4. Key-Value Map Record
export const ChatMap: Record<ChatType, string> = {
  TEXT: 'TEXT',
  MEDIA: 'MEDIA',
  START_CALL: 'START_CALL',
  END_CALL: 'END_CALL',
  MISSED_CALL: 'MISSED_CALL',
  COIN_GRANTED: 'COIN_GRANTED'
}

// 5. String-to-Enum Converter Function
export function toChatEnum (value?: string): chatEnum | undefined {
  if (!value) return undefined
  const upperValue = value.toUpperCase()
  if (upperValue === chatEnum.TEXT) return chatEnum.TEXT
  if (upperValue === chatEnum.MEDIA) return chatEnum.MEDIA
  if (upperValue === chatEnum.START_CALL) return chatEnum.START_CALL
  if (upperValue === chatEnum.END_CALL) return chatEnum.END_CALL
  if (upperValue === chatEnum.MISSED_CALL) return chatEnum.MISSED_CALL
  if (upperValue === chatEnum.COIN_GRANTED) return chatEnum.COIN_GRANTED
  return undefined
}

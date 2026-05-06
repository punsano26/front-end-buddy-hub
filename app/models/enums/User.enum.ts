import type { IBaseOptions } from '../Global.model'

export enum genderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export const UserGenderOptions: IBaseOptions<genderEnum>[] = [
  {
    label: 'ชาย',
    value: genderEnum.MALE
  },
  {
    label: 'หญิง',
    value: genderEnum.FEMALE
  },
  {
    label: 'อื่นๆ',
    value: genderEnum.OTHER
  }
] as const

export type UserGenderType = keyof typeof genderEnum

export const UserGenderMap: Record<UserGenderType, string> = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
}

export function toGenderEnum (value?: string): genderEnum | undefined {
  if (!value) return undefined
  if (value === genderEnum.MALE) return genderEnum.MALE
  if (value === genderEnum.FEMALE) return genderEnum.FEMALE
  if (value === genderEnum.OTHER) return genderEnum.OTHER
  return undefined
}

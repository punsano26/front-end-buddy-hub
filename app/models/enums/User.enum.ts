import type { IBaseOptions } from '../Global.model'

export enum genderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum genderQueryEnum {
  ALL = 'ALL',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
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
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
}

export function toGenderEnum (value?: string): genderEnum | undefined {
  if (!value) return undefined
  const upperValue = value.toUpperCase()
  if (upperValue === genderEnum.MALE) return genderEnum.MALE
  if (upperValue === genderEnum.FEMALE) return genderEnum.FEMALE
  if (upperValue === genderEnum.OTHER) return genderEnum.OTHER
  return undefined
}

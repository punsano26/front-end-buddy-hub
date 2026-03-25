export enum genderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export function toGenderEnum (value?: string): genderEnum | undefined {
  if (!value) return undefined
  if (value === genderEnum.MALE) return genderEnum.MALE
  if (value === genderEnum.FEMALE) return genderEnum.FEMALE
  if (value === genderEnum.OTHER) return genderEnum.OTHER
  return undefined
}

export interface ICheckAuthPayload {
  account: string
}

export interface IAuthLoginPayload {
  account: string
  password: string
}

export interface IAuthRegisterPayload {
  email: string
  username: string
  password: string
  confirmPassword: string
  gender: genderEnum
  dateOfBirth: string
}

export enum genderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

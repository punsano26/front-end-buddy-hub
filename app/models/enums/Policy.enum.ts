import type { IBaseOptions } from '../Global.model'

export enum policyTypeEnum {
  TERMS_OF_USE = 'TERMS_OF_USE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  SAFETY_INSTRUCTIONS = 'SAFETY_INSTRUCTIONS'
}

export const PolicyTypeOptions: IBaseOptions<policyTypeEnum>[] = [
  {
    label: 'ข้อกำหนดและเงื่อนไขการใช้งาน',
    value: policyTypeEnum.TERMS_OF_USE
  },
  {
    label: 'นโยบายความเป็นส่วนตัว',
    value: policyTypeEnum.PRIVACY_POLICY
  },
  {
    label: 'คำแนะนำด้านความปลอดภัย',
    value: policyTypeEnum.SAFETY_INSTRUCTIONS
  }
] as const

export type PolicyType = keyof typeof policyTypeEnum

export const PolicyTypeMap: Record<PolicyType, string> = {
  TERMS_OF_USE: 'TERMS_OF_USE',
  PRIVACY_POLICY: 'PRIVACY_POLICY',
  SAFETY_INSTRUCTIONS: 'SAFETY_INSTRUCTIONS'
}

export function toPolicyTypeEnum (value?: string): policyTypeEnum | undefined {
  if (!value) return undefined
  const upperValue = value.toUpperCase()
  if (upperValue === policyTypeEnum.TERMS_OF_USE) return policyTypeEnum.TERMS_OF_USE
  if (upperValue === policyTypeEnum.PRIVACY_POLICY) return policyTypeEnum.PRIVACY_POLICY
  if (upperValue === policyTypeEnum.SAFETY_INSTRUCTIONS) return policyTypeEnum.SAFETY_INSTRUCTIONS
  return undefined
}

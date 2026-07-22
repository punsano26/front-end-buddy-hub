import type { IBaseOptions } from '../Global.model'

export enum deviceTypeEnum {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}

export const DeviceTypeOptions: IBaseOptions<deviceTypeEnum>[] = [
  {
    label: 'เดสก์ท็อป',
    value: deviceTypeEnum.DESKTOP
  },
  {
    label: 'มือถือ',
    value: deviceTypeEnum.MOBILE
  },
  {
    label: 'แท็บเล็ต',
    value: deviceTypeEnum.TABLET
  },
  {
    label: 'ไม่ระบุ',
    value: deviceTypeEnum.UNKNOWN
  }
] as const

export type DeviceType = keyof typeof deviceTypeEnum

export const DeviceTypeMap: Record<DeviceType, string> = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  UNKNOWN: 'unknown'
}

export function toDeviceTypeEnum (value?: string): deviceTypeEnum | undefined {
  if (!value) return undefined
  const lowerValue = value.toLowerCase()
  if (lowerValue === deviceTypeEnum.DESKTOP) return deviceTypeEnum.DESKTOP
  if (lowerValue === deviceTypeEnum.MOBILE) return deviceTypeEnum.MOBILE
  if (lowerValue === deviceTypeEnum.TABLET) return deviceTypeEnum.TABLET
  if (lowerValue === deviceTypeEnum.UNKNOWN) return deviceTypeEnum.UNKNOWN
  return undefined
}

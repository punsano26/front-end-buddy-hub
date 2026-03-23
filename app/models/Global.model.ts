
export interface IMenuItem {
  label?: string
  icon?: string
  items?: IMenuItem[]
  command?: () => void
}
export interface IItems {
  label: string
  command: () => void
}
export interface IBaseOptions<T = string | number> {
  label: string
  value: T | null | boolean
}

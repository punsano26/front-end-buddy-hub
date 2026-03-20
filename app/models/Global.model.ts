
export interface IMenuItem {
  label?: string
  icon?: string
  items?: IMenuItem[]
  command?: () => void
}

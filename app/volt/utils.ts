import { twMerge } from 'tailwind-merge'
import { mergeProps } from 'vue'

export const ptViewMerge = (
  globalPTProps: Record<string, any> = {},
  selfPTProps: Record<string, any> = {},
  datasets: Record<string, any>
): any => {
  const { class: globalClass, ...globalRest } = globalPTProps
  const { class: selfClass, ...selfRest } = selfPTProps

  return mergeProps({ class: twMerge(globalClass, selfClass) }, globalRest, selfRest, datasets)
}

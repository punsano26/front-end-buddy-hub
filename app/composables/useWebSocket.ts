export const useWebSocket = (): any => {
  const { $ws } = useNuxtApp()
  return $ws
}

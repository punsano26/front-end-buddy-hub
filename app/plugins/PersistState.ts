import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }: any): void => {
  $pinia.use(piniaPluginPersistedstate)
})

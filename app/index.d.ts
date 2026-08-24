import type { handleLoading } from './plugins/HandleLoading'

// Define an interface for all your plugin injections
interface PluginsInjections {
  $handleLoading: typeof handleLoading
}

// Extend the #app module's NuxtApp interface
declare module '#app' {
  interface NuxtApp extends PluginsInjections {}
}

// Extend @vue/runtime-core for component custom properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginsInjections {}
}

// Optional: Extend nuxt/dist/app/nuxt for broader compatibility
declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp extends PluginsInjections {}
}

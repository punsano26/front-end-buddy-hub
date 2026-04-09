declare module '#app' {
  interface NuxtApp {
    $ws: () => WebSocket | null
  }
}

export {}

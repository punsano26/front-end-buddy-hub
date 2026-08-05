import { loadStripe, type Stripe } from '@stripe/stripe-js'

export default defineNuxtPlugin(
  async (): Promise<{
    provide: {
      stripe: Stripe | null
    }
  }> => {
    const config = useRuntimeConfig()

    const stripe = await loadStripe(
      config.public.stripePublishableKey
    )

    return {
      provide: {
        stripe
      }
    }
  }
)

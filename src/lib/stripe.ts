import Stripe from 'stripe'

function envCents(key: string, fallback: number): number {
  const v = process.env[key]
  return v !== undefined ? parseInt(v, 10) : fallback
}

export function getPrices() {
  return {
    giveaway: envCents('LISTING_FEE_GIVEAWAY', 0),
    sale: envCents('LISTING_FEE_SALE', 1000),
    renewal: envCents('LISTING_FEE_RENEWAL', 500),
  }
}

export const PRICES = {
  get giveaway() { return getPrices().giveaway },
  get sale() { return getPrices().sale },
  get renewal() { return getPrices().renewal },
}

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-08-26.dahlia',
    })
  }
  return _stripe
}

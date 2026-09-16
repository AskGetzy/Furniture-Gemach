import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
})

export const PRICES = {
  giveaway: 1500,   // $15.00
  sale: 2500,       // $25.00
  renewal: 500,     // $5.00
} as const

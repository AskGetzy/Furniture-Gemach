import PostForm from './PostForm'
import { getPrices } from '@/lib/stripe'

export const metadata = {
  title: "Post a Listing — Zeh M'zeh",
  description: 'List your furniture for the community. Giveaways are free to post, sales from $10.',
}

export default function PostPage() {
  const prices = getPrices()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a Listing</h1>
          <p className="text-gray-500 text-sm mt-1">
            {prices.giveaway === 0
              ? 'Giveaways are free to post. Sales listings have a small fee.'
              : 'Fill in the details below. Your listing goes live after payment.'}
          </p>
        </div>
        <PostForm giveawayFee={prices.giveaway} saleFee={prices.sale} />
      </div>
    </div>
  )
}

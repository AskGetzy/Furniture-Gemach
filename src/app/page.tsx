import Link from 'next/link'
import { ArrowRight, Gift, Tag, MapPin, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🛋️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Furniture Gemach
          </h1>
          <p className="text-xl text-gray-600 mb-3 max-w-2xl mx-auto">
            A community resource connecting families with furniture they need — free or affordable.
          </p>
          <p className="text-gray-500 mb-8 text-sm">Serving Monsey · Monroe · Brooklyn · Lakewood</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/giveaways"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Gift size={18} />
              Browse Free Furniture
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sales"
              className="inline-flex items-center gap-2 bg-white text-blue-700 border-2 border-blue-200 px-6 py-3 rounded-xl font-semibold hover:border-blue-400 transition-colors"
            >
              <Tag size={18} />
              Browse For-Sale Items
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors"
            >
              Post a Listing
            </Link>
          </div>
        </div>
      </section>

      {/* Two sections */}
      <section className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-8">
        <Link href="/giveaways" className="group bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 hover:border-emerald-400 hover:shadow-md transition-all">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">Giveaways</h2>
          <p className="text-emerald-700 text-sm mb-4">
            Community members giving away furniture they no longer need — completely free to a good home.
          </p>
          <div className="flex items-center gap-1 text-emerald-700 font-medium text-sm group-hover:gap-2 transition-all">
            Browse free furniture <ArrowRight size={15} />
          </div>
        </Link>

        <Link href="/sales" className="group bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-md transition-all">
          <div className="text-4xl mb-3">🏷️</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">For Sale</h2>
          <p className="text-blue-700 text-sm mb-4">
            Quality furniture at community prices. Filter by area, category, and price to find what you need.
          </p>
          <div className="flex items-center gap-1 text-blue-700 font-medium text-sm group-hover:gap-2 transition-all">
            Browse for-sale items <ArrowRight size={15} />
          </div>
        </Link>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-gray-100 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-gray-800 mb-1">Post with photos</h3>
              <p className="text-gray-500 text-sm">Upload 2–3 photos, describe your item, and set your price (or mark it free).</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-800 mb-1">Reach your community</h3>
              <p className="text-gray-500 text-sm">Listings are filtered by area so neighbors find exactly what they need.</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-800 mb-1">Connect directly</h3>
              <p className="text-gray-500 text-sm">Interested families contact you directly. No middleman, no fees for buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Serving these communities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Monsey', 'Monroe', 'Brooklyn', 'Lakewood'].map(area => (
            <Link
              key={area}
              href={`/giveaways?area=${area}`}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <MapPin size={16} className="text-emerald-600" />
              <span className="font-medium text-gray-700 text-sm">{area}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Post CTA */}
      <section className="bg-emerald-700 text-white py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Have furniture to give away or sell?</h2>
          <p className="text-emerald-100 mb-6 text-sm">
            It takes just a few minutes. Upload photos, describe the item, and we'll connect you with your community.
          </p>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Post a Listing — Starting at $15
            <ArrowRight size={16} />
          </Link>
          <p className="text-emerald-200 text-xs mt-3">Giveaway listings: $15 · For-sale listings: $25</p>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield size={16} />
          <span>Listings are community-moderated. <Link href="/terms" className="underline hover:text-gray-600">See our terms of service.</Link></span>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { ArrowRight, Gift, Tag, MapPin, Shield, Camera, Users } from 'lucide-react'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getActiveCount(): Promise<number> {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const activeCount = await getActiveCount()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden border-b border-emerald-100 py-14 md:py-24 px-4">
        {/* Gradient mesh blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="absolute top-8 right-0 w-96 h-96 rounded-full bg-teal-50/80 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-emerald-50/90 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-2 animate-bounce-drop"
            style={{ animationDelay: '0ms' }}
          >
            Zeh M'zeh
          </h1>

          <div
            className="mb-4 animate-fade-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <span dir="rtl" className="text-3xl md:text-4xl font-bold text-emerald-900 tracking-wide">
              זה מזה
            </span>
          </div>

          <p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-slide-up"
            style={{ animationDelay: '180ms' }}
          >
            A community resource connecting families with furniture they need — free or affordable.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-slide-up"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/giveaways"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-sm"
            >
              <Gift size={18} />
              Browse Free Furniture
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sales"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 border-2 border-blue-200 px-6 py-3 rounded-xl font-semibold hover:border-blue-400 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Tag size={18} />
              Browse For-Sale Items
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Post a Listing
            </Link>
          </div>

          {/* Secondary info — subdued, below CTAs */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 animate-fade-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            {activeCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeCount} active listing{activeCount !== 1 ? 's' : ''}
              </span>
            )}
            <span className="text-gray-300 text-xs hidden sm:inline">·</span>
            {['Monsey', 'Monroe', 'Brooklyn', 'Lakewood'].map((area, i) => (
              <span key={area} className="flex items-center gap-x-1 text-xs text-gray-400">
                {i > 0 && <span className="text-gray-300 mr-1">·</span>}
                <Link href={`/giveaways?area=${area}`} className="hover:text-emerald-600 transition-colors flex items-center gap-0.5">
                  <MapPin size={10} />
                  {area}
                </Link>
              </span>
            ))}
          </div>

          {/* Pricing transparency */}
          <p
            className="mt-2 text-xs text-gray-400 animate-fade-slide-up"
            style={{ animationDelay: '340ms' }}
          >
            Free to post giveaways · $10 to post for sale
          </p>
        </div>
      </section>

      {/* Two sections */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8">
        <AnimateOnScroll delay={0}>
          <Link href="/giveaways" className="group bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 transition-all block">
            <div className="w-14 h-14 rounded-2xl bg-emerald-200 flex items-center justify-center mb-4">
              <Gift size={28} className="text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Giveaways</h2>
            <p className="text-emerald-700 text-sm mb-4">
              Community members giving away furniture they no longer need — completely free to a good home.
            </p>
            <div className="flex items-center gap-1 text-emerald-700 font-medium text-sm group-hover:gap-2 transition-all">
              Browse free furniture <ArrowRight size={15} />
            </div>
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <Link href="/sales" className="group bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all block">
            <div className="w-14 h-14 rounded-2xl bg-blue-200 flex items-center justify-center mb-4">
              <Tag size={28} className="text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">For Sale</h2>
            <p className="text-blue-700 text-sm mb-4">
              Quality furniture at community prices. Filter by area, category, and price to find what you need.
            </p>
            <div className="flex items-center gap-1 text-blue-700 font-medium text-sm group-hover:gap-2 transition-all">
              Browse for-sale items <ArrowRight size={15} />
            </div>
          </Link>
        </AnimateOnScroll>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-gray-100 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">How it works</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { Icon: Camera, bg: 'bg-emerald-100', color: 'text-emerald-700', title: 'Post with photos',      body: 'Upload 2–3 photos, describe your item, and set your price (or mark it free).' },
              { Icon: MapPin, bg: 'bg-teal-100',    color: 'text-teal-700',    title: 'Reach your community', body: 'Listings are filtered by area so neighbors find exactly what they need.' },
              { Icon: Users,  bg: 'bg-blue-100',    color: 'text-blue-700',    title: 'Connect directly',     body: 'Interested families contact you directly. No middleman, no fees for buyers.' },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 100}>
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.Icon size={26} className={item.color} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll delay={200}>
            <p className="mt-14 text-center text-sm text-gray-500 max-w-lg mx-auto">
              This is <span className="font-medium text-gray-700">Zeh Nehena V'Zeh Nehena</span> —{' '}
              <span dir="rtl" className="text-emerald-800 font-medium">זה נהנה וזה נהנה</span>
              {' '}— this one benefits and this one benefits.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Post CTA */}
      <AnimateOnScroll>
        <section className="bg-emerald-700 text-white py-20 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Have furniture to give away or sell?</h2>
            <p className="text-emerald-100 mb-8 text-sm">
              It takes just a few minutes. Upload photos, describe the item, and we'll connect you with your community.
            </p>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Post a Listing — Free to Post
              <ArrowRight size={16} />
            </Link>
            <p className="text-emerald-200 text-xs mt-4">Giveaway listings: Free · For-sale listings: $10</p>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Trust */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield size={16} />
          <span>Listings are community-moderated. <Link href="/terms" className="underline hover:text-gray-600">See our terms of service.</Link></span>
        </div>
      </section>
    </div>
  )
}

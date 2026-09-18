import Link from 'next/link'
import { ArrowRight, Gift, Tag, MapPin, Shield, Camera, Users } from 'lucide-react'
import AnimateOnScroll from '@/components/AnimateOnScroll'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden border-b border-emerald-100 py-24 px-4">
        {/* Gradient mesh blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="absolute top-8 right-0 w-96 h-96 rounded-full bg-teal-50/80 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-emerald-50/90 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="text-7xl mb-5 animate-fade-slide-up leading-none"
            style={{ animationDelay: '0ms' }}
          >
            🛋️
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-1 animate-fade-slide-up"
            style={{ animationDelay: '80ms' }}
          >
            Zeh M'zeh
          </h1>
          <div
            className="mb-5 animate-fade-slide-up"
            style={{ animationDelay: '160ms' }}
          >
            <span dir="rtl" className="text-2xl md:text-3xl font-semibold text-emerald-700 tracking-wide">
              זה מזה
            </span>
          </div>
          <p
            className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto animate-fade-slide-up"
            style={{ animationDelay: '240ms' }}
          >
            A community resource connecting families with furniture they need — free or affordable.
          </p>
          <div
            className="mb-4 animate-fade-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            <span dir="rtl" className="text-base text-emerald-600 font-medium italic">
              זה נהנה וזה נהנה
            </span>
            <span className="text-sm text-gray-500 ml-2">— this one benefits and this one benefits</span>
          </div>
          <p
            className="text-gray-500 mb-10 text-sm animate-fade-slide-up"
            style={{ animationDelay: '360ms' }}
          >
            Serving Monsey · Monroe · Brooklyn · Lakewood
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-slide-up"
            style={{ animationDelay: '420ms' }}
          >
            <Link
              href="/giveaways"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-sm"
            >
              <Gift size={18} />
              Browse Free Furniture
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sales"
              className="inline-flex items-center gap-2 bg-white text-blue-700 border-2 border-blue-200 px-6 py-3 rounded-xl font-semibold hover:border-blue-400 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Tag size={18} />
              Browse For-Sale Items
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Post a Listing
            </Link>
          </div>
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
              { Icon: Camera,  bg: 'bg-emerald-100', color: 'text-emerald-700', title: 'Post with photos',       body: 'Upload 2–3 photos, describe your item, and set your price (or mark it free).' },
              { Icon: MapPin,  bg: 'bg-teal-100',    color: 'text-teal-700',    title: 'Reach your community',  body: 'Listings are filtered by area so neighbors find exactly what they need.' },
              { Icon: Users,   bg: 'bg-blue-100',    color: 'text-blue-700',    title: 'Connect directly',      body: 'Interested families contact you directly. No middleman, no fees for buyers.' },
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
        </div>
      </section>

      {/* Areas */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Serving these communities</h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Monsey', 'Monroe', 'Brooklyn', 'Lakewood'].map((area, i) => (
            <AnimateOnScroll key={area} delay={i * 80}>
              <Link
                href={`/giveaways?area=${area}`}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-400 hover:shadow-sm hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <MapPin size={16} className="text-emerald-600" />
                <span className="font-medium text-gray-700 text-sm">{area}</span>
              </Link>
            </AnimateOnScroll>
          ))}
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

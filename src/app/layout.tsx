import type { Metadata } from 'next'
import { Inter, Rubik } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
const rubik = Rubik({ subsets: ['latin', 'hebrew'], variable: '--font-rubik', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.zehmzeh.com'

export const metadata: Metadata = {
  title: "Zeh M'zeh — Community Furniture Giveaways & Sales",
  description: 'Find free and affordable furniture in Monsey, Monroe, Brooklyn, and Lakewood. A community resource for Jewish families.',
  keywords: "zeh m'zeh, furniture gemach, free furniture, furniture for sale, Jewish community, Monsey, Monroe, Brooklyn, Lakewood",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Zeh M'zeh — Community Furniture Giveaways & Sales",
    description: 'Find free and affordable furniture in Monsey, Monroe, Brooklyn, and Lakewood.',
    url: siteUrl,
    siteName: "Zeh M'zeh",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: "Zeh M'zeh community furniture" }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Zeh M'zeh — Community Furniture Giveaways & Sales",
    description: 'Find free and affordable furniture in Monsey, Monroe, Brooklyn, and Lakewood.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${rubik.variable} bg-gray-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

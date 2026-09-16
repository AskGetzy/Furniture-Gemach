import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Furniture Gemach — Community Furniture Giveaways & Sales',
  description: 'Find free and affordable furniture in Monsey, Monroe, Brooklyn, and Lakewood. A community resource for Jewish families.',
  keywords: 'furniture gemach, free furniture, furniture for sale, Jewish community, Monsey, Monroe, Brooklyn, Lakewood',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

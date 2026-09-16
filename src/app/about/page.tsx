export const metadata = {
  title: 'About Us — Furniture Gemach',
  description: 'Learn about the Furniture Gemach mission and how we serve Jewish communities.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-4xl mb-4">🛋️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Furniture Gemach</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg text-gray-600">
          Furniture Gemach is a community-driven platform connecting families who have furniture they no longer need with those who do — strengthening the Jewish communities of Monsey, Monroe, Brooklyn, and Lakewood.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Our Mission</h2>
        <p>
          The word <em>gemach</em> (גמ&quot;ח) comes from <em>gemilut chasadim</em> — acts of loving kindness. Our mission is simple: make it easy for community members to give and receive furniture with dignity. Whether you're setting up a first home, going through a life transition, or simply clearing space, Furniture Gemach is here to help.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Giveaways</strong> — Completely free items. The poster pays a small $15 listing fee to keep the platform running; the item itself costs nothing.</li>
          <li><strong>For Sale listings</strong> — Sellers set their own asking price. A $25 listing fee covers our costs.</li>
          <li><strong>All listings expire after 30 days</strong> — Sale listings can be renewed for $5. Giveaways require a fresh post.</li>
          <li><strong>Contact is protected</strong> — Phone and email are hidden behind a click, so you only share your details with genuinely interested parties.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">A Note on Responsibility</h2>
        <p>
          Furniture Gemach is a listing platform only. We provide the space for community members to connect — we are not a party to any transaction, and we do not inspect, verify, or guarantee any item listed. Please use your own judgment when arranging pickups.
        </p>
        <p>
          If you encounter a listing that violates our terms, please use the "Report" button on any listing page.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact Us</h2>
        <p>
          Questions, suggestions, or concerns? We'd love to hear from you. Use our <a href="/contact" className="text-emerald-700 underline">contact form</a> and we'll get back to you.
        </p>
      </div>
    </div>
  )
}

export const metadata = {
  title: "About Us — Zeh M'zeh",
  description: "Learn about the Zeh M'zeh mission and how we serve Jewish communities.",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-4xl mb-4">🛋️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">About Zeh M'zeh</h1>
      <p dir="rtl" className="text-lg text-emerald-700 font-semibold mb-6">זה מזה</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg text-gray-600">
          Zeh M'zeh is a community-driven platform connecting families who have furniture they no longer need with those who do — strengthening the Jewish communities of Monsey, Monroe, Brooklyn, and Lakewood.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
          <span dir="rtl" className="block text-base font-semibold mb-1">זה נהנה וזה נהנה</span>
          <span className="italic">"This one benefits and this one benefits"</span> — both the giver and receiver come out ahead.
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Our Mission</h2>
        <p>
          The name <em>Zeh M'zeh</em> (זה מזה) captures the spirit of mutual benefit. Our mission is simple: make it easy for community members to give and receive furniture with dignity. Whether you're setting up a first home, going through a life transition, or simply clearing space, Zeh M'zeh is here to help.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Giveaways</strong> — Completely free items. Giveaway listings are currently free to post; the item itself costs nothing for the recipient.</li>
          <li><strong>For Sale listings</strong> — Sellers set their own asking price. A small listing fee covers our costs.</li>
          <li><strong>All listings expire after 30 days</strong> — Sale listings can be renewed. Giveaways require a fresh post.</li>
          <li><strong>Contact is protected</strong> — Phone and email are hidden behind a click, so you only share your details with genuinely interested parties.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">A Note on Responsibility</h2>
        <p>
          Zeh M'zeh is a listing platform only. We provide the space for community members to connect — we are not a party to any transaction, and we do not inspect, verify, or guarantee any item listed. Please use your own judgment when arranging pickups.
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

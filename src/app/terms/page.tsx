export const metadata = {
  title: 'Terms of Service — Furniture Gemach',
  description: 'Furniture Gemach terms of service and liability disclaimer.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Platform Purpose</h2>
          <p>
            Furniture Gemach (&quot;the Site,&quot; &quot;we,&quot; &quot;us&quot;) is a listing platform that allows community members to post and browse furniture giveaways and sales. We provide the technology to connect community members — nothing more.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. No Responsibility for Transactions</h2>
          <p>
            <strong>Furniture Gemach is not a party to any transaction between users.</strong> We do not inspect, verify, guarantee, warrant, or take responsibility for any item listed on the platform. All transactions are solely between the poster and the recipient/buyer. We are not liable for any injury, loss, damage, or dispute arising from any item listed or transaction conducted through this platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Listing Fees</h2>
          <p>
            Listing fees ($15 for giveaways, $25 for for-sale listings) are charged to cover platform costs. <strong>All listing fees are final and non-refundable</strong> unless a refund is manually granted by an administrator at their sole discretion. Listing fees are not a guarantee of any outcome.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Listing Rules</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Listings must be for actual physical furniture items.</li>
            <li>Photos must accurately represent the item being offered.</li>
            <li>Posters are responsible for removing or marking unavailable items that have been given away or sold.</li>
            <li>Listings expire automatically after 30 days.</li>
            <li>We reserve the right to remove any listing that violates these terms or community standards.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Privacy</h2>
          <p>
            Poster addresses are never displayed publicly. Phone numbers and email addresses are shown only when a viewer explicitly clicks to reveal them. By posting a listing, you consent to your contact information being shared with users who request it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Furniture Gemach, its operators, and affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from use of this platform, any listing, or any transaction between users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Changes</h2>
          <p>
            We may update these terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  )
}

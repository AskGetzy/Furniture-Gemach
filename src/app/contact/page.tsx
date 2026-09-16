import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact Us — Furniture Gemach',
  description: 'Get in touch with Furniture Gemach.',
}

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 text-sm mb-8">
        Have a question or feedback? Fill out the form below and we'll get back to you. Messages are sent directly to the Furniture Gemach team.
      </p>
      <ContactForm />
    </div>
  )
}

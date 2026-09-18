import ContactForm from './ContactForm'

export const metadata = {
  title: "Contact Us — Zeh M'zeh",
  description: "Get in touch with Zeh M'zeh.",
}

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 text-sm mb-8">
        Have a question or feedback? Fill out the form below and we'll get back to you. Messages are sent directly to the Zeh M'zeh team.
      </p>
      <ContactForm />
    </div>
  )
}

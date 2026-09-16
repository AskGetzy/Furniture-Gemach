import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'getzyw89@gmail.com'
const FROM = 'Furniture Gemach <noreply@furnituregemach.com>'

export async function sendListingConfirmation(params: {
  to: string
  posterName: string
  listingTitle: string
  pinCode: string
  listingId: string
  expiresAt: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: 'Your Furniture Gemach listing is live!',
    html: `
      <h2>Your listing is now live!</h2>
      <p>Hi ${params.posterName},</p>
      <p>Your listing "<strong>${params.listingTitle}</strong>" has been posted successfully on Furniture Gemach.</p>
      <p><strong>Your PIN code: ${params.pinCode}</strong></p>
      <p>Save this PIN — you'll need it to edit or remove your listing early.</p>
      <p>Your listing will expire on ${new Date(params.expiresAt).toLocaleDateString()}.</p>
      <p><a href="${appUrl}/manage?pin=${params.pinCode}">Manage your listing</a></p>
      <hr />
      <p><em>Please remember to take your listing down once the item is gone!</em></p>
      <p>Thank you for using Furniture Gemach.</p>
    `,
  })
}

export async function sendAdminNewListingNotification(params: {
  listingTitle: string
  listingId: string
  posterName: string
  posterEmail: string
  type: string
  area: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New listing posted: ${params.listingTitle}`,
    html: `
      <h2>New Furniture Gemach listing posted</h2>
      <p><strong>Title:</strong> ${params.listingTitle}</p>
      <p><strong>Type:</strong> ${params.type}</p>
      <p><strong>Area:</strong> ${params.area}</p>
      <p><strong>Posted by:</strong> ${params.posterName} (${params.posterEmail})</p>
      <p><a href="${appUrl}/admin">View in admin dashboard</a></p>
    `,
  })
}

export async function sendExpirationNotice(params: {
  to: string
  posterName: string
  listingTitle: string
  listingId: string
  type: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Your Furniture Gemach listing has expired`,
    html: `
      <h2>Your listing has expired</h2>
      <p>Hi ${params.posterName},</p>
      <p>Your listing "<strong>${params.listingTitle}</strong>" has expired after 30 days.</p>
      ${params.type === 'sale'
        ? `<p>You can renew your listing for another 30 days for just $5. <a href="${appUrl}/listings/${params.listingId}">Renew now</a></p>`
        : `<p>If you'd like to relist the item, please <a href="${appUrl}/post">create a new listing</a>.</p>`
      }
      <p>Your listing will remain in our archive for 90 days before being permanently removed.</p>
      <p>Thank you for using Furniture Gemach.</p>
    `,
  })
}

export async function sendContactEmail(params: {
  name: string
  email: string
  message: string
}) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: params.email,
    subject: `Contact form message from ${params.name}`,
    html: `
      <h2>Contact Form Submission — Furniture Gemach</h2>
      <p><strong>From:</strong> ${params.name} (${params.email})</p>
      <p><strong>Message:</strong></p>
      <p>${params.message.replace(/\n/g, '<br />')}</p>
    `,
  })
}

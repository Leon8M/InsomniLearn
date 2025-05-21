import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendClassEmail = async (email, className, link) => {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: `Your ${className} Access Link`,
    html: `<p>Join class here: <a href="${link}">${link}</a></p>`
  })
}
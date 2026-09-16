import { profile } from '../content'
import { IconMail, gmailWebUrl, openGmail } from './ui'

export default function EmailButton({ className = '' }) {
  return (
    <a
      href={gmailWebUrl(profile.email)}
      onClick={(e) => openGmail(e, profile.email)}
      target="_blank"
      rel="noreferrer noopener"
      title={profile.email}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark ${className}`}
    >
      <IconMail width={15} height={15} />
      Email
    </a>
  )
}

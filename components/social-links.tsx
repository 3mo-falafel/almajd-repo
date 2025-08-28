"use client"
import { Facebook } from "lucide-react"

// Simple inline WhatsApp icon (lucide doesn't include it natively)
const WhatsAppIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <path d="M16.72 13.88c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.73 4.14.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z" />
    <path d="M12 22c-1.82 0-3.6-.49-5.14-1.43L2 22l1.5-4.73A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10Z" />
  </svg>
)

export function SocialLinks() {
  const links = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1M7vp9JFma/?mibextid=wwXIfr",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#145cc0]",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/972598403676",
      icon: WhatsAppIcon,
      color: "bg-[#25D366] hover:bg-[#1da851]",
    },
  ]

  return (
  <div className="container-custom mt-4 flex space-x-3">
      {links.map((l) => (
        <a
          key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${l.color}`}
        >
          <l.icon size={18} />
          <span className="sr-only">{l.name}</span>
        </a>
      ))}
    </div>
  )
}

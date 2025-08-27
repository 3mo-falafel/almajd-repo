"use client"
import { motion } from "framer-motion"
import { Facebook, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t, language } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    [t("footer.categories")]: [
      { name: t("categories.men"), href: "/products?category=men" },
      { name: t("categories.women"), href: "/products?category=women" },
      { name: t("categories.boys"), href: "/products?category=boys" },
      { name: t("categories.girls"), href: "/products?category=girls" },
    ],
    [t("footer.company")]: [
      { name: t("footer.about"), href: "#" },
      { name: t("footer.contact"), href: "#" },
    ],
    [t("footer.pages")]: [{ name: t("header.products"), href: "/products" }],
  }

  const WhatsAppIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M16.72 13.88c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.73 4.14.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z" />
      <path d="M12 22c-1.82 0-3.6-.49-5.14-1.43L2 22l1.5-4.73A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10Z" />
    </svg>
  )

  const socialLinks = [
    {
      name: t("footer.facebook"),
      icon: Facebook,
      href: "https://www.facebook.com/share/1M7vp9JFma/?mibextid=wwXIfr",
      color: "bg-[#1877F2] hover:bg-[#145cc0]",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      href: "https://wa.me/972598403676",
      color: "bg-[#25D366] hover:bg-[#1da851]",
    },
  ]

  // Personal designer credit links (colorful)
  const LinkedInIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
    >
      <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM3 9h4v12H3V9Zm7.5 0h3.83v1.71h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.14c0-1.23-.02-2.81-1.71-2.81-1.71 0-1.97 1.34-1.97 2.72V21h-4V9Z" />
    </svg>
  )

  const personalLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/jibreel.e.bornat",
      color: "bg-[#1877F2] hover:bg-[#145cc0]",
      icon: Facebook,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/972599765211",
      color: "bg-[#25D366] hover:bg-[#1da851]",
      icon: WhatsAppIcon,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/jibreel-bornat-140718330",
      color: "bg-[#0A66C2] hover:bg-[#084f96]",
      icon: LinkedInIcon,
    },
  ]

  return (
    <footer className="bg-white/[0.02] border-t border-white/[0.02]">
      <div className="container-custom py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">{t("hero.title1")}</h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">{t("footer.companyDescription")}</p>
              <div className="flex space-x-4">
        {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={18} />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-neutral-900 mb-4">{category}</h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 group flex items-center"
                        >
                          {link.name}
                          <ArrowUpRight
                            size={14}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-8 pb-4 border-t border-neutral-200 flex justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-neutral-500 text-center">
            <p>{t("footer.copyright")}</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-neutral-700 transition-colors">
                {t("footer.privacyPolicy")}
              </a>
              <a href="#" className="hover:text-neutral-700 transition-colors">
                {t("footer.termsOfService")}
              </a>
              <a href="#" className="hover:text-neutral-700 transition-colors">
                {t("footer.cookies")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Designer Credit Section */}
      <div className="border-t border-neutral-200 pt-6 pb-10">
        <div className="container-custom flex flex-col items-center space-y-4 text-center">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">{t("footer.designedBy")}</span> {" "}
            <span className="font-semibold">{language === "ar" ? "جبريل برناط" : "Jibreel Bornat"}</span>
          </p>
          <div className="flex space-x-3">
            {personalLinks.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${p.color}`}
              >
                <p.icon size={18} />
                <span className="sr-only">{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

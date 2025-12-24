"use client"

import Link from "next/link"
import Logo from "../components/logo"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { useLanguage } from "../components/language-provider"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Logo />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t.footer.quickLinks}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/cars" className="text-gray-400 hover:text-primary transition-colors">
                  {t.nav.cars}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t.footer.contactInfo}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+212 661-528619</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+212 661-528659</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>Melodylocation@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t.footer.followUs}</h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/fadlocar/"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">{t.footer.rights}</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-primary">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-primary">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

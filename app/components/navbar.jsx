"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Menu,
  Car,
  Phone,
  Home,
  FileText,
  Globe,
  Briefcase,
  MessageCircle,
  X,
} from "lucide-react"

import Logo from "../components/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "../components/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const whatsappLink =
    "https://wa.me/212661528619?text=Bonjour%2C%20je%20veux%20réserver%20une%20voiture."

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = useMemo(
    () => [
      { name: t.nav.home, href: "/", icon: Home },
      { name: t.nav.cars, href: "/cars", icon: Car },
      { name: t.nav.services, href: "/services", icon: Briefcase },
      { name: t.nav.blog, href: "/blog", icon: FileText },
      { name: t.nav.contact, href: "/contact", icon: Phone },
    ],
    [t]
  )

  const isActive = (href) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  const NavLink = ({ href, children }) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive(href) ? "text-primary" : "text-white/80 hover:text-white"
      }`}
    >
      {children}
    </Link>
  )

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Center (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Language"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white">
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={language === "en" ? "text-primary bg-white/10" : "hover:bg-white/5"}
              >
                English
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setLanguage("fr")}
                className={language === "fr" ? "text-primary bg-white/10" : "hover:bg-white/5"}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* WhatsApp */}
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              className="border-green-500/40 text-green-200 hover:text-white hover:bg-green-600/20 rounded-full px-4"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
          </a>

          {/* Book */}
          <Link href="/cars">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-5">
              {t.nav.bookNow}
            </Button>
          </Link>
        </div>

        {/* Mobile / Tablet */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Language quick toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            aria-label="Toggle language"
          >
            {language === "en" ? "FR" : "EN"}
          </Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:text-white hover:bg-white/10"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="bg-black/95 border-white/10 text-white p-0">
              <SheetHeader className="px-6 pt-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white">Menu</SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="px-6 py-6 flex flex-col gap-3">
                {/* Links */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition ${
                        isActive(item.href)
                          ? "bg-white/10 text-primary"
                          : "text-white/85 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-white/10 my-3" />

                {/* CTA buttons */}
                <div className="flex flex-col gap-3">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>

                  <Link href="/cars" onClick={() => setSheetOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                      {t.nav.bookNow}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
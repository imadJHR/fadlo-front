"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, Car, Phone, Home, FileText, Globe, Briefcase, MessageCircle } from "lucide-react"   // ← WhatsApp icon added
import Logo from "../components/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "../components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  const navItems = [
    { name: t.nav.home, href: "/", icon: Home },
    { name: t.nav.cars, href: "/cars", icon: Car },
    { name: t.nav.services, href: "/services", icon: Briefcase },
    { name: t.nav.blog, href: "/blog", icon: FileText },
    { name: t.nav.contact, href: "/contact", icon: Phone },
  ]

  const whatsappLink =
    "https://wa.me/+212661528619?text=Bonjour%2C%20je%20veux%20réserver%20une%20voiture." // ← Replace with real number

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-white/80"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* LANGUAGE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white">
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={`${language === "en" ? "text-primary bg-white/10" : "hover:bg-white/5"}`}
              >
                English
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setLanguage("fr")}
                className={`${language === "fr" ? "text-primary bg-white/10" : "hover:bg-white/5"}`}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DESKTOP WHATSAPP BUTTON */}
          <a href={whatsappLink} target="_blank">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </a>

          {/* DESKTOP BOOK BUTTON */}
          <Link href="/cars">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              {t.nav.bookNow}
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          {/* LANGUAGE TOGGLE */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          >
            {language === "en" ? "FR" : "EN"}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="bg-black/95 border-white/10 text-white">
              <div className="flex flex-col gap-8 mt-10">

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-2xl font-bold flex items-center gap-4 hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-white/80"
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                    {item.name}
                  </Link>
                ))}

                {/* MOBILE WHATSAPP BUTTON */}
                <a href={whatsappLink} target="_blank">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full mt-2 flex items-center gap-3">
                    <MessageCircle className="h-6 w-6" />
                    WhatsApp
                  </Button>
                </a>

                {/* MOBILE BOOK BUTTON */}
                <Link href="/cars">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full mt-2">
                    {t.nav.bookNow}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

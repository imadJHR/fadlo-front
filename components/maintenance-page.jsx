"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Phone, MessageCircle, Instagram, Mail, Clock, ArrowRight } from "lucide-react"
import logo from "../public/logo.png"

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black overflow-hidden">

      {/* ── Full-screen gradient ── */}
      <div className="absolute inset-0">
        {/* Deep red glow top-left */}
        <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-[180px]" />
        {/* Subtle glow bottom-right */}
        <div className="absolute bottom-[-25%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-primary/15 via-red-900/5 to-transparent blur-[160px]" />
        {/* Center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">

        {/* Logo — bigger */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Subtle glow behind logo */}
            <div className="absolute inset-4 rounded-full bg-primary/15 blur-[60px]" />
            {/* Thin decorative ring */}
            <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
            {/* Logo image */}
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32">
              <Image
                src={logo}
                alt="Fadlo Car"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-4"
        >
          <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
            Site en{" "}
            <span className="bg-gradient-to-r from-primary via-red-400 to-red-500 bg-clip-text text-transparent">
              Maintenance
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-gray-500 text-base sm:text-lg text-center max-w-md leading-relaxed mb-8"
        >
          Nous peaufinons chaque détail pour vous offrir une expérience encore plus fluide.
          <br />
          <span className="text-gray-600">Merci de votre patience.</span>
        </motion.p>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs tracking-wide mb-12"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <Clock className="w-3 h-3" />
          Mise à jour en cours
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-gray-500 text-xs uppercase tracking-[0.15em] text-center mb-4">
            Contact rapide
          </p>

          <div className="space-y-3">
            {/* WhatsApp 1 */}
            <a
              href="https://wa.me/212661528619?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20voiture."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-primary/10 hover:border-primary/25 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium leading-tight">+212 661-528619</p>
                  <p className="text-gray-500 text-[11px]">WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </a>

            {/* WhatsApp 2 */}
            <a
              href="https://wa.me/212661528659?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20voiture."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-primary/10 hover:border-primary/25 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium leading-tight">+212 661-528659</p>
                  <p className="text-gray-500 text-[11px]">WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <a
            href="https://www.instagram.com/fadlocar/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
            title="Instagram"
          >
            <Instagram className="w-4.5 h-4.5" />
          </a>
          <a
            href="mailto:Melodylocation@gmail.com"
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
            title="Email"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative z-10 pb-6 text-center"
      >
        <p className="text-gray-700 text-[11px] tracking-[0.15em] uppercase">
          &copy; {new Date().getFullYear()} Fadlo Car
        </p>
      </motion.div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Car, Plane, Heart, Briefcase, Calendar, PenTool as Tool
} from "lucide-react"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { useLanguage } from "../components/language-provider"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ServicesClientPage() {
  const { lang, t } = useLanguage()
  const [selected, setSelected] = useState(null)

  const services = [
    { id: "chauffeur", icon: Car },
    { id: "airport", icon: Plane },
    { id: "wedding", icon: Heart },
    { id: "corporate", icon: Briefcase },
    { id: "longTerm", icon: Calendar },
    { id: "assistance", icon: Tool },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold"
        >
          {t.servicesPage.title}{" "}
          <span className="text-primary">{t.servicesPage.titleSpan}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-300 mt-4 max-w-2xl mx-auto"
        >
          {t.servicesPage.description}
        </motion.p>
      </section>

      {/* GRID */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 0px 12px rgba(255,255,255,0.15)"
              }}
            >
              <Card className="bg-white/5 border-white/10 transition">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 bg-primary/20 rounded-xl flex justify-center items-center mb-4"
                  >
                    <s.icon className="h-7 w-7 text-primary" />
                  </motion.div>

                  <CardTitle>{t.servicesPage[s.id].title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-300">
                    {t.servicesPage[s.id].description}
                  </CardDescription>

                  {/* Show Details Button */}
                  <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
                    <Button
                      variant="outline"
                      className="text-white border-white/40 w-full"
                      onClick={() => setSelected(s)}
                    >
                      {t.servicesPage.showDetails}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO CONTENT SECTION */}
      <section className="container mx-auto px-4 pb-24 text-gray-300">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >

          <h2 className="text-3xl font-bold text-white mb-6">
            {t.servicesPage.seoSection.h2}
          </h2>

          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p1}
          </p>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            {t.servicesPage.seoSection.h3_1}
          </h3>
          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p2}
          </p>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            {t.servicesPage.seoSection.h3_2}
          </h3>
          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p3}
          </p>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            {t.servicesPage.seoSection.h3_3}
          </h3>
          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p4}
          </p>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            {t.servicesPage.seoSection.h3_4}
          </h3>
          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p5}
          </p>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            {t.servicesPage.seoSection.h3_5}
          </h3>
          <p className="mb-6 leading-relaxed">
            {t.servicesPage.seoSection.p6}
          </p>

          <p className="leading-relaxed">
            {t.servicesPage.seoSection.p7}
          </p>

        </motion.div>
      </section>

      <Footer />

      {/* POPUP */}
      <AnimatePresence>
        {selected && (
          <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className="bg-black border border-white/10 text-white max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <selected.icon className="text-primary" />
                    {t.servicesPage[selected.id].title}
                  </DialogTitle>

                  <DialogDescription className="text-gray-300 mt-4">
                    {t.servicesPage[selected.id].longDescription}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="text-white border-white/40"
                    onClick={() => setSelected(null)}
                  >
                    {t.servicesPage.popupClose}
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  )
}

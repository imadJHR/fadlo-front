"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Fuel, Gauge, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../components/language-provider"

const API_BASE = "http://localhost:5000"

export default function CarCard({ car, index = 0 }) {
  const { t } = useLanguage()

  const getImageUrl = (img) => {
    if (!img) return "/placeholder-car.jpg"
    if (/^https?:\/\//i.test(img)) return img
    const clean = img.replace(/^\/+/ , "").replace(/\\/g, "/")
    return `${API_BASE}/${clean}`
  }

  const rawImage = car.image || (Array.isArray(car.images) ? car.images[0] : null)
  const imageUrl = getImageUrl(rawImage)

  const name = car.nom || car.name || "Unnamed Car"
  const price = car.prixParJour ?? car.price ?? "--"
  const type = car.type || "Car"
  const slug = car.slug || ""

  const seats = car.specifications?.seats ?? "--"
  const transmission = car.specifications?.transmission ?? "--"
  const fuel = car.specifications?.fuel ?? "--"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Card className="relative overflow-hidden group h-full flex flex-col rounded-3xl border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500">

        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* IMAGE */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-40 transition-all duration-300 mix-blend-overlay z-10" />

          {/* Image */}
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms]"
            whileHover={{ rotate: 0.3 }}
          />

          {/* Badge */}
          <Badge className="absolute top-4 right-4 z-20 bg-primary text-white border-none shadow-md text-sm px-3 py-1 rounded-full backdrop-blur-md">
            {type}
          </Badge>
        </div>

        {/* CONTENT */}
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors duration-300 tracking-wide">
              {name}
            </h3>

            <div className="text-right">
              <p className="text-3xl font-extrabold text-primary drop-shadow-lg">€{price}</p>
              <p className="text-xs text-gray-400">{t.carsPage.perDay}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[{
              icon: <Users className="h-5 w-5" />,
              label: `${seats} ${t.carsPage.seats}`
            },{
              icon: <Gauge className="h-5 w-5" />,
              label: transmission
            },{
              icon: <Fuel className="h-5 w-5" />,
              label: fuel
            }].map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-2 text-gray-300"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
                <span className="text-xs opacity-80">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>

        {/* Disponibilité */}
        <p
          className={`${car.disponible ? "text-green-400" : "text-red-500"} text-center mb-2 text-sm font-medium tracking-wide`}
        >
          {car.disponible ? "Disponible" : "Non disponible"}
        </p>

        {/* CTA */}
        <CardFooter className="p-6 pt-0">
          <Button
            asChild={!car.disponible}
            disabled={!car.disponible}
            className={`w-full rounded-full py-5 shadow-lg transition-all duration-300 text-white text-lg tracking-wide
              ${car.disponible
                ? "bg-primary/80 hover:bg-primary hover:scale-[1.02]"
                : "bg-gray-600/40 text-gray-400 cursor-not-allowed"}
            `}
          >
            {car.disponible ? (
              <Link href={slug ? `/cars/${slug}` : "#"} className="flex items-center justify-center gap-2">
                {t.carsPage.rentNow}
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {t.carsPage.rentNow}
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

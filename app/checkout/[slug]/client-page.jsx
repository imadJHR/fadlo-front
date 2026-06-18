"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { useLanguage } from "@/app/components/language-provider"
import { Button } from "@/components/ui/button"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CheckCircle2, MessageCircle, Shield, Clock3, CarFront } from "lucide-react"
import { format } from "date-fns"

export default function CheckoutPage({ carData = null }) {
  const { slug } = useParams()
  const { t } = useLanguage()

  const [car, setCar] = useState(carData)
  const [loading, setLoading] = useState(!carData)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [pickupDate, setPickupDate] = useState()
  const [returnDate, setReturnDate] = useState()

  const [loadingOrder, setLoadingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const API_BASE = "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws"
  const API_URL = `${API_BASE}/api/vehicules/${slug}`
  const minSelectableDate = new Date()
  minSelectableDate.setHours(0, 0, 0, 0)

  const getImageUrl = (img) => {
    if (!img || typeof img !== "string") return "/placeholder-car.jpg"
    if (img.startsWith("http://") || img.startsWith("https://")) return img
    if (img.startsWith("//")) return `https:${img}`
    return `${API_BASE}/${img.replace(/^\/+/, "").replace(/\\/g, "/")}`
  }

  useEffect(() => {
    if (!slug || carData) return

    const fetchCar = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" })
        const data = await res.json()
        if (data.success) setCar(data.vehicule)
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [slug, carData])

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const diff = (returnDate - pickupDate) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }

  const totalDays = calculateDays()
  const totalPrice = totalDays * (car?.prixParJour || 0)

  async function handleBooking() {
    if (!fullName || !email || !phone || !pickupDate || !returnDate) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    setLoadingOrder(true)

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car: car._id,
          fullName,
          email,
          phone,
          pickupDate: pickupDate.toISOString(),
          returnDate: returnDate.toISOString(),
          totalDays,
          totalPrice,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setOrderSuccess(true)
      } else {
        alert(data.message || "Erreur lors de la reservation.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur serveur.")
    } finally {
      setLoadingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Car not found
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.18),transparent_34%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_28%)]" />
        <div className="container relative mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/25 bg-red-600/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-red-300">
              <CarFront className="h-3.5 w-3.5" />
              Reservation premium
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.checkout.rent} {car.nom}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/58 sm:text-lg">
              Finalisez votre demande en quelques etapes. Nous confirmons rapidement la disponibilite, le tarif et les details de livraison.
            </p>
          </div>

          {orderSuccess && (
            <div className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-base font-medium text-emerald-300">
              Votre reservation a ete envoyee avec succes.
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)]">
                <div className="aspect-[16/10] overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#111215_0%,#09090b_100%)]">
                  <img
                    src={getImageUrl(car.images?.[0])}
                    className="h-full w-full object-contain p-4"
                    alt={car.nom}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-car.jpg"
                    }}
                  />
                </div>

                <div className="mt-5">
                  <h2 className="text-3xl font-black text-white">{car.nom}</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <SummaryItem label={t.carsPage.seats} value={car.specifications?.seats} />
                    <SummaryItem label={t.carsPage.transmission} value={car.specifications?.transmission} />
                    <SummaryItem label={t.carsPage.fuel} value={car.specifications?.fuel} />
                    <SummaryItem label="Type" value={car.type} />
                  </div>
                  <div className="mt-6 flex items-end gap-3">
                    <p className="text-4xl font-black leading-none text-red-500">EUR {car.prixParJour}</p>
                    <p className="pb-1 text-sm font-medium text-white/45">{t.carsPage.perDay}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.34)]">
                <div className="space-y-3 text-sm text-white/68">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-red-400" />
                    Verification rapide de disponibilite avant confirmation finale
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-red-400" />
                    Reponse rapide pour reservation, aeroport et demandes urgentes
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-red-400" />
                    Accompagnement humain de la demande jusqu'a la remise du vehicule
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-8 md:p-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Formulaire de reservation</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {t.checkout.description}
                  </h2>
                </div>
                <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-200">
                  Confirmation apres validation de la demande
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label={t.checkout.fullName}>
                  <input
                    type="text"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-red-500/45"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field>

                <Field label={t.checkout.email}>
                  <input
                    type="email"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-red-500/45"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field label={t.checkout.phone}>
                  <input
                    type="text"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-red-500/45"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>

                <Field label={t.search.pickupDate}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex h-12 w-full items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-left text-white outline-none transition hover:border-white/20">
                        <CalendarIcon className="mr-2 h-4 w-4 text-white/40" />
                        {pickupDate ? format(pickupDate, "dd/MM/yyyy") : t.search.pickupDate}
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="rounded-2xl border border-white/10 bg-black p-2">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => date < minSelectableDate}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field label={t.search.returnDate}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex h-12 w-full items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-left text-white outline-none transition hover:border-white/20">
                        <CalendarIcon className="mr-2 h-4 w-4 text-white/40" />
                        {returnDate ? format(returnDate, "dd/MM/yyyy") : t.search.returnDate}
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="rounded-2xl border border-white/10 bg-black p-2">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) =>
                          pickupDate ? date < pickupDate : date < minSelectableDate
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/8 bg-black/28 p-5">
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                  <span className="text-sm font-medium text-white/52">{t.checkout.totalDuration}</span>
                  <span className="text-lg font-bold text-white">
                    {totalDays} {t.checkout.days}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-white/52">{t.checkout.totalPrice}</span>
                  <span className="text-3xl font-black text-red-500">EUR {totalPrice}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 flex-1 rounded-full bg-red-600 px-8 text-base font-bold text-white hover:bg-red-700"
                  onClick={handleBooking}
                  disabled={loadingOrder}
                >
                  {loadingOrder ? "..." : t.checkout.confirmBooking}
                </Button>

                <a
                  href={`https://wa.me/212661528619?text=I want to book the ${
                    car.nom
                  }. Total: EUR ${totalPrice}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 text-base font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.carsPage.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/72">{label}</label>
      {children}
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/32">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value || "--"}</p>
    </div>
  )
}

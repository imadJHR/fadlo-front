"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Gauge,
  Fuel,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock3,
  MapPin,
  MessageCircle,
} from "lucide-react"
import { useLanguage } from "@/app/components/language-provider"
import { Button } from "@/components/ui/button"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

export default function CarDetailClientPage() {
  const { slug } = useParams()
  const { t } = useLanguage()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(null)
  const [relatedCars, setRelatedCars] = useState([])

  const API_URL = `https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws/api/vehicules/${slug}`
  const RELATED_URL = `https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws/api/vehicules/related/${slug}`

  useEffect(() => {
    if (!slug) return

    const fetchCar = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" })
        if (!res.ok) return setCar(null)

        const data = await res.json()

        if (data.success) {
          setCar(data.vehicule)
          setMainImage(data.vehicule.images?.[0] || null)
        }
      } catch (err) {
        console.error("Error loading car:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchRelated = async () => {
      try {
        const res = await fetch(RELATED_URL, { cache: "no-store" })
        const data = await res.json()
        if (data.success) setRelatedCars(data.vehicules)
      } catch (err) {
        console.error("Error loading related cars:", err)
      }
    }

    fetchCar().then(fetchRelated)
  }, [slug])

  const getImageUrl = (img) => {
    if (!img) return "/placeholder-car.jpg"
    if (typeof img !== "string") return "/placeholder-car.jpg"
    if (img.startsWith("http://") || img.startsWith("https://")) return img
    if (img.startsWith("//")) return `https:${img}`

    return `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${img.replace(
      /^\/+/, ""
    )}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    )
  }

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white text-xl">
        Car not found
      </div>
    )
  }

  const specs = [
    {
      icon: <Users className="h-5 w-5" />,
      title: t.carsPage.seats,
      value: `${car.specifications?.seats ?? "--"}`,
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      title: t.carsPage.transmission,
      value: car.specifications?.transmission || "--",
    },
    {
      icon: <Fuel className="h-5 w-5" />,
      title: t.carsPage.fuel,
      value: car.specifications?.fuel || "--",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Type",
      value: car.type || "--",
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.18),transparent_34%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_28%)]" />
        <div className="container relative mx-auto max-w-7xl">
          <Link
            href="/cars"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/72 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.carsPage.backToFleet}
          </Link>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#111215_0%,#09090b_100%)]">
                <div className="absolute inset-x-6 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent z-10" />
                <img
                  src={getImageUrl(mainImage)}
                  alt={car.nom}
                  className="h-full w-full object-contain object-center p-4 sm:p-5"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {car.images?.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`overflow-hidden rounded-2xl border bg-black/45 transition-all duration-300 ${
                      mainImage === img
                        ? "border-red-500 shadow-[0_10px_30px_rgba(255,90,54,0.18)]"
                        : "border-white/8 hover:border-white/20"
                    }`}
                    onClick={() => setMainImage(img)}
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={getImageUrl(img)}
                        className="h-full w-full object-contain bg-black/60 p-2"
                        alt={`image-${index}`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-600/25 bg-red-600/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-red-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {car.type || "Premium vehicle"}
                </div>

                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  {car.nom}
                </h1>

                <p className="mt-4 text-base leading-relaxed text-white/58 sm:text-lg">
                  {car.description || t.carsPage.noDescription}
                </p>

                <div className="mt-6 flex items-end gap-3">
                  <p className="text-5xl font-black leading-none text-red-500">EUR {car.prixParJour}</p>
                  <p className="pb-1 text-sm font-medium text-white/45">{t.carsPage.perDay}</p>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {specs.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600/10 text-red-400">
                        {item.icon}
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                        {item.title}
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-3 rounded-[28px] border border-white/8 bg-black/30 p-5">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Shield className="h-4 w-4 text-red-400" />
                    Assurance et verifications selon l'offre
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Clock3 className="h-4 w-4 text-red-400" />
                    Reponse rapide pour reservation et disponibilite
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <MapPin className="h-4 w-4 text-red-400" />
                    Livraison aeroport, hotel et domicile selon ville
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 flex-1 rounded-full bg-red-600 text-base font-bold text-white hover:bg-red-700"
                  >
                    <Link href={`/checkout/${car.slug}`}>
                      {t.carsPage.rentNow}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <a
                    href={`https://wa.me/212645288216?text=Hello, I want to rent the ${car.nom}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-base font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t.carsPage.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.92))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-8 md:p-10">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {t.carsPage.features}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/55 sm:text-lg">
            Une presentation claire des caracteristiques essentielles pour vous aider a choisir rapidement le vehicule adapte a votre besoin.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {specs.map((item) => (
              <div
                key={`${item.title}-large`}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-600/20 bg-red-600/10 text-red-400">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/32">{item.title}</p>
                <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedCars.length > 0 && (
        <section className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Selection associee</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {t.carsPage.relatedCars || "Related Cars"}
              </h2>
            </div>
            <Link href="/cars" className="text-sm font-semibold text-red-400 transition hover:text-red-300">
              {t.carsPage.backToFleet}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCars.map((rc) => (
              <Link
                key={rc._id}
                href={`/cars/${rc.slug}`}
                className="group overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.9))] transition-all duration-500 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.34)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-black/20">
                  <img
                    src={getImageUrl(rc.images?.[0])}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={rc.nom}
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white transition group-hover:text-red-400">
                    {rc.nom}
                  </h3>
                  <p className="mt-1 text-sm text-white/45">{rc.marque}</p>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className="text-2xl font-black text-red-500">
                      EUR {rc.prixParJour}
                    </p>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
                      {t.carsPage.perDay}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-20 sm:px-6 md:pb-24">
        <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,90,54,0.14),rgba(10,10,12,0.94))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-8 md:p-12">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            <span className="text-red-400">FADLO CAR</span> - {t.whyFadloCar.title}
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            {t.whyFadloCar.intro}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureBox icon="FLEET" title={t.whyFadloCar.fleetTitle} desc={t.whyFadloCar.fleetDesc} />
            <FeatureBox icon="PRICE" title={t.whyFadloCar.transparentTitle} desc={t.whyFadloCar.transparentDesc} />
            <FeatureBox icon="DELIVERY" title={t.whyFadloCar.deliveryTitle} desc={t.whyFadloCar.deliveryDesc} />
            <FeatureBox icon="SUPPORT" title={t.whyFadloCar.supportTitle} desc={t.whyFadloCar.supportDesc} />
            <FeatureBox icon="TRUST" title={t.whyFadloCar.experienceTitle} desc={t.whyFadloCar.experienceDesc} />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/25 px-5 py-5 text-center text-base font-semibold text-white sm:px-6 sm:text-lg md:text-xl">
            {t.whyFadloCar.finalNote}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FeatureBox({ icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 transition-all duration-300 hover:border-red-600/30">
      <div className="mb-4 inline-flex rounded-2xl border border-red-600/18 bg-red-600/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{desc}</p>
    </div>
  )
}

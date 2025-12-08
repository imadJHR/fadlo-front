"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Users, Gauge, Fuel, ArrowLeft } from "lucide-react"
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

  const API_URL = `http://localhost:5000/api/vehicules/${slug}`
  const RELATED_URL = `http://localhost:5000/api/vehicules/related/${slug}`

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
    return `http://localhost:5000/${img.replace(/^\/+/, "")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Car not found
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />

      <div className="container mx-auto px-4 max-w-7xl">

        {/* BACK BUTTON */}
        <Link 
          href="/cars"
          className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition text-sm md:text-base"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t.carsPage.backToFleet}
        </Link>

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold break-words">
            {car.nom}
          </h1>
          <p className="text-gray-300 text-base md:text-lg mt-4 max-w-3xl leading-relaxed">
            {car.description || t.carsPage.noDescription}
          </p>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {/* MAIN IMAGE */}
          <div className="lg:col-span-2">
            <div className="w-full rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
              <img
                src={getImageUrl(mainImage)}
                alt={car.nom}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2">
            {car.images?.map((img, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden border-2 cursor-pointer transition flex-shrink-0 w-32 h-24 md:w-40 md:h-28 lg:w-full lg:h-32 ${
                  mainImage === img
                    ? "border-primary scale-[1.03] shadow-xl"
                    : "border-white/10 hover:border-white/40"
                }`}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={getImageUrl(img)}
                  className="w-full h-full object-contain bg-black"
                  alt={`image-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SPECIFICATIONS */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t.carsPage.features}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14">
          <SpecBox icon={<Users />} label={`${car.specifications?.seats} ${t.carsPage.seats}`} />
          <SpecBox icon={<Gauge />} label={car.specifications?.transmission} />
          <SpecBox icon={<Fuel />} label={car.specifications?.fuel} />
          <SpecBox icon={<></>} label={car.type} big />
        </div>

        {/* PRICE + CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-3xl md:text-4xl font-bold text-primary">
            €{car.prixParJour}
            <span className="text-sm text-gray-400 ml-2">{t.carsPage.perDay}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-primary/80 w-full sm:w-auto"
            >
              <Link href={`/checkout/${car.slug}`}>{t.carsPage.rentNow}</Link>
            </Button>

            <a
              href={`https://wa.me/212645288216?text=Hello, I want to rent the ${car.nom}`}
              target="_blank"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-semibold w-full sm:w-auto text-center"
            >
              {t.carsPage.whatsapp}
            </a>
          </div>
        </div>

        {/* ⭐⭐⭐ RELATED CARS SECTION ⭐⭐⭐ */}
        {relatedCars.length > 0 && (
          <section className="mt-20 mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">
              {t.carsPage.relatedCars || "Related Cars"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCars.map((rc) => (
                <Link
                  key={rc._id}
                  href={`/cars/${rc.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/40 transition"
                >
                  <div className="aspect-video bg-black/20">
                    <img
                      src={getImageUrl(rc.images?.[0])}
                      className="w-full h-full object-cover"
                      alt={rc.nom}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition">
                      {rc.nom}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">{rc.marque}</p>

                    <p className="text-primary text-lg font-bold mt-3">
                      €{rc.prixParJour}
                      <span className="text-gray-400 text-sm ml-2">{t.carsPage.perDay}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* WHY FADLO CAR SECTION */}
        <section className="mt-20 bg-gradient-to-b from-black to-black/90 rounded-2xl p-6 md:p-10 border border-white/10 shadow-xl">

          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            <span className="text-primary">FADLO CAR</span> — {t.whyFadloCar.title}
          </h2>

          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12 md:mb-16 text-sm md:text-base">
            {t.whyFadloCar.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureBox icon="🚗" title={t.whyFadloCar.fleetTitle} desc={t.whyFadloCar.fleetDesc} />
            <FeatureBox icon="💰" title={t.whyFadloCar.transparentTitle} desc={t.whyFadloCar.transparentDesc} />
            <FeatureBox icon="📍" title={t.whyFadloCar.deliveryTitle} desc={t.whyFadloCar.deliveryDesc} />
            <FeatureBox icon="🛡️" title={t.whyFadloCar.supportTitle} desc={t.whyFadloCar.supportDesc} />
            <FeatureBox icon="⭐" title={t.whyFadloCar.experienceTitle} desc={t.whyFadloCar.experienceDesc} />
          </div>

          <div className="mt-14 p-6 bg-primary/10 border border-primary/30 rounded-xl text-center shadow-lg">
            <p className="text-lg md:text-xl text-white font-semibold">
              {t.whyFadloCar.finalNote}
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  )
}

/* SPEC BOX */
function SpecBox({ icon, label, big = false }) {
  return (
    <div className="spec-box flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
      {icon && <div className="h-7 w-7 mb-2 text-white">{icon}</div>}
      <p className={`text-sm md:text-lg ${big ? "font-bold text-xl" : ""}`}>{label}</p>
    </div>
  )
}

/* FEATURE BOX */
function FeatureBox({ icon, title, desc }) {
  return (
    <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
      <div className="text-primary text-3xl mb-3">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm md:text-base">{desc}</p>
    </div>
  )
}

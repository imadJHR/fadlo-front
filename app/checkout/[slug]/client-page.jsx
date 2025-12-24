"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { useLanguage } from "@/app/components/language-provider"
import { Button } from "@/components/ui/button"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function CheckoutPage() {
  const { slug } = useParams()
  const { t } = useLanguage()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [pickupDate, setPickupDate] = useState()
  const [returnDate, setReturnDate] = useState()

  const [loadingOrder, setLoadingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const API_URL = `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules/${slug}`

  // ------------------------ FETCH CAR ------------------------
  useEffect(() => {
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
  }, [slug])

  // ------------------------ PRICE CALCULATION ------------------------
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const diff = (returnDate - pickupDate) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }

  const totalDays = calculateDays()
  const totalPrice = totalDays * (car?.prixParJour || 0)

  const getImageUrl = (img) =>
    img ? `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${img.replace(/^\/+/, "")}` : "/placeholder-car.jpg"

  // ------------------------ SEND ORDER ------------------------
  async function handleBooking() {
    if (!fullName || !email || !phone || !pickupDate || !returnDate) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    setLoadingOrder(true)

    try {
      const res = await fetch("https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car: car._id,
          fullName,
          email,
          phone,
          pickupDate,
          returnDate,
          totalDays,
          totalPrice,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setOrderSuccess(true)
      } else {
        alert("Erreur lors de la réservation.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur serveur.")
    }

    setLoadingOrder(false)
  }

  // ------------------------ UI ------------------------

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>

  if (!car)
    return <div className="min-h-screen flex items-center justify-center text-white">Car not found</div>

  return (
    <main className="min-h-screen bg-black text-white pt-28">
      <Navbar />

      <div className="container mx-auto px-4 pb-24">
        <h1 className="text-4xl font-bold mb-8">
          {t.checkout.rent} {car.nom}
        </h1>

        {orderSuccess && (
          <div className="bg-green-600 text-white p-4 rounded-xl mb-6 text-center text-lg font-semibold">
            ✔ Votre réservation a été envoyée avec succès !
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ---------------- CAR SUMMARY ---------------- */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl">
            <img src={getImageUrl(car.images?.[0])} className="w-full h-48 object-cover rounded-lg mb-4" />

            <h2 className="text-2xl font-bold">{car.nom}</h2>

            <p className="text-gray-300 mt-2"><strong>{t.carsPage.seats}:</strong> {car.specifications?.seats}</p>
            <p className="text-gray-300"><strong>{t.carsPage.transmission}:</strong> {car.specifications?.transmission}</p>
            <p className="text-gray-300"><strong>{t.carsPage.fuel}:</strong> {car.specifications?.fuel}</p>

            <p className="text-primary text-3xl font-bold mt-4">
              €{car.prixParJour} <span className="text-sm">{t.carsPage.perDay}</span>
            </p>
          </div>

          {/* ---------------- CHECKOUT FORM ---------------- */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-xl shadow-xl">

            <h2 className="text-2xl font-semibold mb-6">{t.checkout.description}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <div>
                <label className="block text-gray-300 mb-2">{t.checkout.fullName}</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-gray-300 mb-2">{t.checkout.email}</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-gray-300 mb-2">{t.checkout.phone}</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* PICKUP DATE */}
              <div>
                <label className="block text-gray-300 mb-2">{t.search.pickupDate}</label>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full p-3 pl-10 rounded-lg bg-black/40 border border-white/20 flex items-center text-left">
                      <CalendarIcon className="mr-2 text-gray-400" />
                      {pickupDate ? format(pickupDate, "dd/MM/yyyy") : t.search.pickupDate}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="bg-black border border-white/20 p-2 rounded-xl">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* RETURN DATE */}
              <div>
                <label className="block text-gray-300 mb-2">{t.search.returnDate}</label>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full p-3 pl-10 rounded-lg bg-black/40 border border-white/20 flex items-center text-left">
                      <CalendarIcon className="mr-2 text-gray-400" />
                      {returnDate ? format(returnDate, "dd/MM/yyyy") : t.search.returnDate}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="bg-black border border-white/20 p-2 rounded-xl">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => date < pickupDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-10 text-xl">
              <p>{t.checkout.totalDuration}: <span className="text-primary">{totalDays} {t.checkout.days}</span></p>
              <p className="mt-2">{t.checkout.totalPrice}: <span className="text-primary font-bold">€{totalPrice}</span></p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-10">
              <Button
                className="bg-primary text-white px-8 py-3 text-lg"
                onClick={handleBooking}
                disabled={loadingOrder}
              >
                {loadingOrder ? "..." : t.checkout.confirmBooking}
              </Button>

              <a
                href={`https://wa.me/212600000000?text=I want to book the ${car.nom}. Total: €${totalPrice}`}
                target="_blank"
                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
              >
                {t.carsPage.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

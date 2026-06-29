import CheckoutClientPage from "./client-page"
import { notFound } from "next/navigation"

const API_BASE = "https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws"

const getImageUrl = (img) => {
  if (!img || typeof img !== "string") return "/hero.png"
  if (img.startsWith("http://") || img.startsWith("https://")) return img
  if (img.startsWith("//")) return `https:${img}`
  return `${API_BASE}/${img.replace(/^\/+/, "").replace(/\\/g, "/")}`
}

// ----------- SEO DYNAMIQUE -----------
export async function generateMetadata(props) {
  const { slug } = await props.params

  try {
    const res = await fetch(`${API_BASE}/api/vehicules/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return { title: "Checkout - FADLO CAR" }
    }

    const data = await res.json()
    const car = data?.vehicule

    if (!car) {
      return { title: "Checkout - FADLO CAR" }
    }

    const image = getImageUrl(car.images?.[0])

    return {
      title: `Reservation ${car.nom} | Fadlo Car Casablanca`,
      description: `Finalisez votre demande de reservation pour ${car.nom}. Location voiture premium a Casablanca avec confirmation rapide.`,
      robots: {
        index: false,
        follow: true,
      },
      openGraph: {
        title: `Reservation ${car.nom} | Fadlo Car`,
        description: `Location ${car.nom} a Casablanca avec Fadlo Car.`,
        images: [image],
      },
    }
  } catch (err) {
    return { title: "Checkout - FADLO CAR" }
  }
}

// ----------- PAGE SERVER SIDE -----------
export default async function CheckoutPage(props) {
  // ⚠️ Next.js 16 → params doit être await
  const { slug } = await props.params

  if (!slug) return notFound()

  try {
    const res = await fetch(`${API_BASE}/api/vehicules/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) return notFound()

    const data = await res.json()

    if (!data.success || !data.vehicule) return notFound()

    // Pass only the car data to the client page
    return <CheckoutClientPage carData={data.vehicule} />
  } catch (err) {
    console.error("Checkout preload error:", err)
    return notFound()
  }
}

import CheckoutClientPage from "./client-page"
import { notFound } from "next/navigation"

// ----------- SEO DYNAMIQUE -----------
export async function generateMetadata(props) {
  const { slug } = await props.params

  try {
    const res = await fetch(`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules/${slug}`, {
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

    return {
      title: `Checkout – ${car.nom} | FADLO CAR`,
      description: `Rent the ${car.nom}. Fast, secure and premium car rental in Morocco.`,
      openGraph: {
        title: `Checkout – ${car.nom}`,
        description: `Rent the ${car.nom} today. Premium service & best prices in Morocco.`,
        images: [`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${car.images?.[0]}`],
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
    const res = await fetch(`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules/${slug}`, {
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

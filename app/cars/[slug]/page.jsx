import CarDetailsClient from "./client-page"

const API_BASE = "https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws"

const getImageUrl = (img) => {
  if (!img || typeof img !== "string") return "/hero.png"
  if (img.startsWith("http://") || img.startsWith("https://")) return img
  if (img.startsWith("//")) return `https:${img}`
  return `${API_BASE}/${img.replace(/^\/+/, "").replace(/\\/g, "/")}`
}

export async function generateMetadata(props) {
  const { slug } = await props.params

  try {
    const res = await fetch(`${API_BASE}/api/vehicules/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        title: "Voiture introuvable | Fadlo Car",
        robots: { index: false, follow: false },
      }
    }

    const data = await res.json()
    const car = data?.vehicule

    if (!car) {
      return {
        title: "Voiture introuvable | Fadlo Car",
        robots: { index: false, follow: false },
      }
    }

    const title = `${car.nom} Location Casablanca | Fadlo Car`
    const description =
      car.description ||
      `Louez ${car.nom} a Casablanca avec Fadlo Car. Tarif journalier, disponibilite, livraison aeroport et reservation rapide.`
    const canonical = `https://fadllocar.ma/cars/${slug}`
    const image = getImageUrl(car.images?.[0])

    return {
      title,
      description,
      keywords: [
        `${car.nom} location casablanca`,
        `${car.nom} rental morocco`,
        "location voiture casablanca",
        "location voiture aeroport casablanca",
        "Fadlo Car",
      ],
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Fadlo Car",
        type: "website",
        locale: "fr_MA",
        images: [
          {
            url: image,
            alt: car.nom,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (err) {
    return {
      title: "Location Voiture Casablanca | Fadlo Car",
      robots: { index: true, follow: true },
    }
  }
}

// ✔ Next.js 16 → params is a Promise, must be awaited
export default async function CarDetailsPage(props) {
  const { slug } = await props.params

  // ✔ Pass only the slug to the client component
  //   The client will fetch the car data itself
  return <CarDetailsClient slug={slug} />
}

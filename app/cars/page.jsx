import CarsClientPage from "./client-page"

export const metadata = {
  title: "Location Voiture Casablanca | Notre Flotte de Vehicules",
  description:
    "Decouvrez notre flotte de voitures a louer a Casablanca : citadines, SUV, automatiques et vehicules premium avec reservation rapide chez Fadlo Car.",
  keywords: [
    "location voiture casablanca flotte",
    "voiture a louer casablanca",
    "suv location casablanca",
    "voiture automatique casablanca",
    "location voiture maroc premium",
  ],
  alternates: {
    canonical: "https://fadlocar.com/cars",
  },
  openGraph: {
    title: "Notre Flotte | Location Voiture Casablanca - Fadlo Car",
    description:
      "Choisissez votre voiture de location a Casablanca parmi notre flotte de modeles economiques, SUV et premium.",
    url: "https://fadlocar.com/cars",
    siteName: "Fadlo Car",
    locale: "fr_MA",
    type: "website",
    images: ["/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notre Flotte | Location Voiture Casablanca - Fadlo Car",
    description:
      "Choisissez votre voiture de location a Casablanca parmi notre flotte de modeles economiques, SUV et premium.",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CarsPage() {
  return <CarsClientPage />
}

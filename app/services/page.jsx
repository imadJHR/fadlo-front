import ServicesClientPage from "./client-page"

export const metadata = {
  title: "Car Rental Services in Morocco | Chauffeur, Airport Transfer, Weddings – FADLO CAR",
  description:
    "Discover premium car rental services in Morocco: Chauffeur service, Airport transfer (Casablanca CMN, Marrakech RAK), Wedding cars, Corporate fleet, Long-term rentals & 24/7 assistance. Luxury & comfort guaranteed.",

  keywords: [
    "car rental Morocco",
    "chauffeur service Morocco",
    "airport transfer Casablanca CMN",
    "airport transfer Marrakech RAK",
    "wedding car rental Morocco",
    "business car rental Morocco",
    "long term car rental Morocco",
    "rent a car Casablanca",
    "luxury car rental Morocco",
    "FADLO CAR services",
  ],

  openGraph: {
    title: "Premium Car Rental Services in Morocco | FADLO CAR",
    description:
      "Top-rated car rental services in Morocco: Chauffeur, Airport Transfer, Luxury Wedding Cars, Corporate Fleet & Long-Term Rentals.",
    url: "https://fadlocar.com/services",
    siteName: "FADLO CAR",
    images: [
      {
        url: "/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "FADLO CAR Services – Morocco Car Rental",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FADLO CAR – Premium Car Rental Services in Morocco",
    description:
      "Explore FADLO CAR’s premium services: Chauffeur, Airport Transfers, Corporate Solutions, Wedding Cars & Long-Term rentals.",
    images: ["/og-services.jpg"],
  },

  alternates: {
    canonical: "https://fadlocar.com/services",
    languages: {
      "en-US": "https://fadlocar.com/en/services",
      "fr-FR": "https://fadlocar.com/fr/services",
    },
  },
}

export default function ServicesPage() {
  return <ServicesClientPage />
}

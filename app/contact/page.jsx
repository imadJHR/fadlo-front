import ContactClientPage from "./client-page"

export const metadata = {
  title: "Contact Location Voiture Casablanca | Fadlo Car",
  description:
    "Contactez Fadlo Car pour reserver une voiture a Casablanca, demander un devis, organiser une livraison aeroport ou obtenir une assistance rapide.",
  keywords: [
    "contact location voiture casablanca",
    "agence location voiture casablanca contact",
    "telephone fadlo car",
    "reservation voiture aeroport casablanca",
  ],
  alternates: {
    canonical: "https://fadlocar.com/contact",
  },
  openGraph: {
    title: "Contact Fadlo Car | Reservation Voiture Casablanca",
    description:
      "Telephone, email et demande de devis pour votre location de voiture a Casablanca et au Maroc.",
    url: "https://fadlocar.com/contact",
    siteName: "Fadlo Car",
    locale: "fr_MA",
    type: "website",
    images: ["/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Fadlo Car | Reservation Voiture Casablanca",
    description:
      "Telephone, email et demande de devis pour votre location de voiture a Casablanca et au Maroc.",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactClientPage />
}

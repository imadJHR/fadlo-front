import HomePage from "./components/home-page";

const title =
  "Location Voiture Casablanca | Fadlo Car - Agence de Location au Maroc";
const description =
  "Reservez une voiture a Casablanca avec Fadlo Car. Vehicules economiques, SUV et voitures premium, livraison aeroport Mohammed V, assurance et assistance 24/7.";

export const metadata = {
  metadataBase: new URL("https://fadlocar.com"),
  title,
  description,
  applicationName: "Fadlo Car",
  category: "Car Rental",
  keywords: [
    "location voiture casablanca",
    "location de voiture casablanca",
    "louer voiture casablanca",
    "location voiture aeroport casablanca",
    "location voiture maroc",
    "car rental casablanca",
    "Fadlo Car",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "fr-MA": "/",
      en: "/",
    },
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Fadlo Car",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Fadlo Car - Location de voiture a Casablanca",
      },
    ],
    locale: "fr_MA",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function Page() {
  return <HomePage />;
}

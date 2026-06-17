import HomePage from "./components/home-page";

const title =
  "Location Voiture Casablanca | Fadlo Car - Agence de Location au Maroc";
const description =
  "Reservez une voiture a Casablanca avec Fadlo Car. Vehicules economiques, SUV et voitures premium, livraison aeroport Mohammed V, assurance et assistance 24/7.";
const canonicalUrl = "https://fadlocar.com";

export const metadata = {
  metadataBase: new URL(canonicalUrl),
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
    "agence location casablanca",
    "voiture pas cher maroc",
    "location vehicule maroc",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "fr-MA": "/",
      en: "/en",
    },
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
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
    determiner: "auto",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.png"],
    site: "@fadlocar",
    creator: "@fadlocar",
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
  other: {
    "geo.region": "MA-CAS",
    "geo.placename": "Casablanca",
    "geo.position": "33.5170286119286;-7.654152168275857",
    "ICBM": "33.5170286119286, -7.654152168275857",
  },
};

export default function Page() {
  return <HomePage />;
}

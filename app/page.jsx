import HomePage from "../app/components/home-page"; // Adjust this import path

export const metadata = {
  title: "Location de Voiture Casablanca | Luxe & Économique - Fadlo Car",
  description: "Réservez votre voiture de location à Casablanca au meilleur prix. Large choix de véhicules de luxe, sport et économiques. Service 24/7, livraison aéroport.",
  keywords: ["location voiture casablanca", "louer voiture maroc", "location luxe casablanca", "auto rental morocco"],
  openGraph: {
    title: "Location de Voiture Casablanca - Fadlo Car",
    description: "La meilleure agence de location de voitures à Casablanca.",
    url: "https://fadlocar.com",
    siteName: "Fadlo Car",
    images: [
      {
        url: "/hero.png", // Ensure this path is correct publicly
        width: 1200,
        height: 630,
        alt: "Fadlo Car Location Casablanca",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://fadlocar.com",
  },
};

export default function Page() {
  return <HomePage />;
}
import BlogClientPage from "./client-page"

export const metadata = {
  title: "Blog Location Voiture Casablanca | Conseils, Guides et Actualites",
  description:
    "Conseils location voiture a Casablanca, guides premium au Maroc, inspirations mariage, longue duree et actualites automobile par Fadlo Car.",
  keywords: [
    "blog location voiture casablanca",
    "conseils location voiture maroc",
    "guide voiture luxe maroc",
    "blog automobile casablanca",
    "location voiture mariage maroc",
    "Fadlo Car blog",
  ],
  alternates: {
    canonical: "https://fadlocar.com/blog",
  },
  openGraph: {
    title: "Blog Location Voiture Casablanca | Fadlo Car",
    description:
      "Guides pratiques, tendances auto et conseils premium pour louer une voiture a Casablanca et au Maroc.",
    url: "https://fadlocar.com/blog",
    siteName: "Fadlo Car",
    locale: "fr_MA",
    type: "website",
    images: ["/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Location Voiture Casablanca | Fadlo Car",
    description:
      "Guides pratiques, tendances auto et conseils premium pour louer une voiture a Casablanca et au Maroc.",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogClientPage />
}

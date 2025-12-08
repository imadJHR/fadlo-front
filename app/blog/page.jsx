import BlogClientPage from "./client-page"

export const metadata = {
  title: "Latest News - FADLO CAR | Blog",
  description:
    "Stay updated with the latest automotive trends, travel guides in Morocco, and company news from FADLO CAR.",
  openGraph: {
    title: "Latest News - FADLO CAR | Blog",
    description: "Stay updated with the latest automotive trends, travel guides in Morocco, and company news.",
    images: ["/logo.png"],
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}

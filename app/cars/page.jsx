import CarsClientPage from "./client-page"

export const metadata = {
  title: "Our Fleet - FADLO CAR | Luxury Car Rental",
  description:
    "Browse our extensive fleet of luxury, sport, and premium SUVs available for rent in Morocco. Find the perfect car for your journey.",
  openGraph: {
    title: "Our Fleet - FADLO CAR | Luxury Car Rental",
    description:
      "Browse our extensive fleet of luxury, sport, and premium SUVs available for rent in Morocco.",
    images: ["/logo.png"],
  },
}

export default function CarsPage() {
  return <CarsClientPage />
}

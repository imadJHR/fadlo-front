import HomePage from "../app/components/home-page"

export const metadata = {
  title: "FADLO CAR - Premium Car Rental Morocco",
  description:
    "Experience the ultimate driving comfort with FADLO CAR. Luxury, Sport, and Economy vehicles available 24/7 in Morocco.",
  openGraph: {
    title: "FADLO CAR - Premium Car Rental Morocco",
    description: "Luxury and economy car rental in Morocco. Best prices, premium service.",
    images: ["/logo.png"],
  },
}

export default function Page() {
  return <HomePage />
}

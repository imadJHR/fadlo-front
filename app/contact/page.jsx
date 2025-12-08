import ContactClientPage from "./client-page"

export const metadata = {
  title: "Contact Us - FADLO CAR | Premium Car Rental",
  description:
    "Get in touch with FADLO CAR for bookings, inquiries, or support. Visit our office in Casablanca or contact us via phone/email.",
  openGraph: {
    title: "Contact Us - FADLO CAR | Premium Car Rental",
    description: "Get in touch with FADLO CAR for bookings, inquiries, or support.",
    images: ["/logo.png"],
  },
}

export default function ContactPage() {
  return <ContactClientPage />
}

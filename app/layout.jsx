import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "../app/components/language-provider"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "FADLO CAR - Premium Car Rental Morocco",
  description: "Luxury and economy car rental in Morocco. Best prices, premium service.",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased bg-background selection:bg-primary selection:text-white`}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-black via-[#1a0000] to-black -z-10" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

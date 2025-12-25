import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "../app/components/language-provider"
import Script from 'next/script' // Importez Script

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
  other: {
    'google-site-verification': 'sYwNmRYBy3-zmbbNTYzvkjIHgD3mNUh_sZzSnNKPPkA',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Site Verification Meta Tag */}
        <meta name="google-site-verification" content="sYwNmRYBy3-zmbbNTYzvkjIHgD3mNUh_sZzSnNKPPkA" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased bg-background selection:bg-primary selection:text-white`}
      >
        {/* Google Analytics Scripts */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-45CWG9PB2H"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-45CWG9PB2H');
            `,
          }}
        />
        
        <div className="fixed inset-0 bg-gradient-to-br from-black via-[#1a0000] to-black -z-10" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
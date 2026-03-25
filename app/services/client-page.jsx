"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Car, Plane, Heart, Briefcase, Calendar, PenTool as Tool,
  ArrowRight, CheckCircle2, Shield, Clock, MapPin, Star,
  Sparkles, Phone, ChevronRight, Zap, Users, Globe, Award,
  ThumbsUp, Headphones, Quote, Play, Target, TrendingUp,
  Navigation, Fuel, Settings, Key, FileText, CreditCard
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"

import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { useLanguage } from "../components/language-provider"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ──────────────────────────── Animated Counter ──────────────────────────── */
function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

/* ──────────────────────────── Floating Particles ──────────────────────────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            background:
              i % 3 === 0
                ? "rgba(220, 38, 38, 0.4)"
                : i % 3 === 1
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(239, 68, 68, 0.3)",
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function ServicesClientPage() {
  const { language, t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeProcess, setActiveProcess] = useState(0)

  const services = [
    { id: "chauffeur", icon: Car },
    { id: "airport", icon: Plane },
    { id: "wedding", icon: Heart },
    { id: "corporate", icon: Briefcase },
    { id: "longTerm", icon: Calendar },
    { id: "assistance", icon: Tool },
  ]

  /* ─── Localized strings ─── */
  const loc = {
    fr: {
      heroTag: "Services Premium au Maroc",
      heroTitle: "Nos",
      heroTitleSpan: "Services",
      heroDesc:
        "Des services premium adaptés à tous vos besoins : déplacements privés, voyages d'affaires, événements ou locations longue durée à Casablanca et partout au Maroc.",
      showDetails: "Voir les détails",
      popupClose: "Fermer",
      bookNow: "Réserver maintenant",
      callUs: "Appelez-nous",
      ctaTitle: "Besoin d'un",
      ctaTitleSpan: "service sur mesure ?",
      ctaDesc:
        "Contactez-nous pour une solution de transport personnalisée à Casablanca, Marrakech, Rabat et partout au Maroc.",
      trustInsurance: "Assurance incluse",
      trust247: "Disponible 24/7",
      trustDelivery: "Livraison aéroport",
      trustClients: "2000+ clients satisfaits",

      // Why choose us
      whyTitle: "Pourquoi choisir nos",
      whyTitleSpan: "services ?",
      whyDesc:
        "Une expérience de transport premium avec des avantages exclusifs pour chaque client.",
      why1Title: "Flotte moderne",
      why1Desc: "Véhicules récents et parfaitement entretenus pour votre confort et sécurité.",
      why2Title: "Prix transparents",
      why2Desc: "Aucun frais caché. Tarifs clairs et compétitifs adaptés à tous les budgets.",
      why3Title: "Couverture nationale",
      why3Desc: "Service disponible dans toutes les grandes villes du Maroc : Casablanca, Rabat, Marrakech, Agadir, Tanger, Fès.",
      why4Title: "Support 24h/24",
      why4Desc: "Notre équipe est disponible à toute heure pour vous assister en cas de besoin.",

      // Stats
      statsVehicles: "Véhicules",
      statsClients: "Clients satisfaits",
      statsCities: "Villes couvertes",
      statsRating: "Note moyenne",

      // Process
      processTag: "Comment ça marche",
      processTitle: "Réservez en",
      processTitleSpan: "4 étapes simples",
      processDesc: "Un processus de réservation simple et rapide pour tous nos services premium.",
      process1Title: "Choisissez votre service",
      process1Desc: "Sélectionnez le service qui correspond à vos besoins : chauffeur, transfert, location longue durée, mariage ou entreprise.",
      process2Title: "Définissez vos détails",
      process2Desc: "Indiquez vos dates, lieu de prise en charge, destination et toute demande spéciale pour personnaliser votre expérience.",
      process3Title: "Confirmez et payez",
      process3Desc: "Vérifiez votre réservation et procédez au paiement sécurisé. Confirmation instantanée par email et WhatsApp.",
      process4Title: "Profitez du service",
      process4Desc: "Votre véhicule et/ou chauffeur vous attend à l'heure et au lieu convenus. Détendez-vous et profitez !",

      // Testimonials
      testimonialsTag: "Témoignages",
      testimonialsTitle: "Ce que disent nos",
      testimonialsTitleSpan: "clients",
      testimonials: [
        {
          name: "Ahmed M.",
          role: "Directeur commercial",
          text: "Le service chauffeur de Fadlo Car est exceptionnel. Ponctualité, discrétion et véhicules haut de gamme. Parfait pour mes déplacements professionnels à Casablanca.",
          rating: 5,
          service: "Service Chauffeur",
        },
        {
          name: "Marie D.",
          role: "Touriste française",
          text: "Transfert aéroport impeccable ! Le chauffeur nous attendait avec une pancarte, la voiture était propre et confortable. Je recommande à 100%.",
          rating: 5,
          service: "Transfert Aéroport",
        },
        {
          name: "Youssef B.",
          role: "Marié heureux",
          text: "La voiture de mariage était magnifique, parfaitement décorée. Le chauffeur était très professionnel. Notre journée a été parfaite grâce à Fadlo Car.",
          rating: 5,
          service: "Voiture de Mariage",
        },
        {
          name: "Sarah K.",
          role: "Expatriée",
          text: "J'ai opté pour la location longue durée et je suis ravie. Prix compétitif, entretien inclus et un excellent service client. Merci Fadlo Car !",
          rating: 5,
          service: "Location Longue Durée",
        },
      ],

      // Included features
      includedTag: "Inclus dans chaque service",
      includedTitle: "Tout est",
      includedTitleSpan: "inclus",
      includedDesc: "Chaque service Fadlo Car comprend des avantages exclusifs pour votre tranquillité d'esprit.",
      included1: "Assurance tous risques",
      included2: "Kilométrage illimité",
      included3: "Assistance routière 24/7",
      included4: "GPS intégré",
      included5: "Entretien régulier",
      included6: "Véhicule de remplacement",
      included7: "Annulation flexible",
      included8: "Paiement sécurisé",

      // Coverage
      coverageTag: "Couverture",
      coverageTitle: "Disponible dans",
      coverageTitleSpan: "tout le Maroc",
      coverageDesc: "Nos services couvrent les principales villes et aéroports du Maroc pour une mobilité sans limites.",
      coverageCities: [
        { name: "Casablanca", airport: "CMN", highlight: true },
        { name: "Marrakech", airport: "RAK", highlight: true },
        { name: "Rabat", airport: "RBA", highlight: false },
        { name: "Tanger", airport: "TNG", highlight: false },
        { name: "Agadir", airport: "AGA", highlight: true },
        { name: "Fès", airport: "FEZ", highlight: false },
        { name: "Oujda", airport: "OUD", highlight: false },
        { name: "Essaouira", airport: "ESU", highlight: false },
      ],

      // Services details
      chauffeur: {
        title: "Service Chauffeur",
        description: "Chauffeurs professionnels pour tous vos déplacements.",
        longDescription:
          "Profitez d'un service chauffeur premium disponible dans tout le Maroc : Casablanca, Marrakech, Rabat, Tanger, Agadir et plus. Votre chauffeur privé garantit ponctualité, sécurité, confort et discrétion. Idéal pour les réunions d'affaires, le transport VIP, les déplacements personnels et les visites touristiques.",
        features: ["Chauffeur professionnel", "Véhicule premium", "Ponctualité garantie", "Discrétion totale"],
      },
      airport: {
        title: "Transfert Aéroport",
        description: "Transferts rapides, fiables et sans stress.",
        longDescription:
          "Service de transfert aéroport 24h/24 avec suivi des vols en temps réel. Nous couvrons Casablanca CMN, Marrakech RAK, Agadir, Rabat, Tanger, Fès et tous les aéroports marocains. Aucun frais d'attente, tarification fixe et chauffeurs professionnels.",
        features: ["Suivi des vols", "Tarif fixe", "Sans frais d'attente", "24h/24"],
      },
      wedding: {
        title: "Voitures de Mariage",
        description: "Véhicules de luxe pour votre jour spécial.",
        longDescription:
          "Rendez votre mariage inoubliable avec nos élégantes voitures de luxe. Décoration personnalisée disponible sur demande, chauffeur élégant et assistance VIP. Disponible dans tout le Maroc pour les cérémonies, les transferts et les séances photo.",
        features: ["Décoration personnalisée", "Chauffeur élégant", "Assistance VIP", "Séance photo"],
      },
      corporate: {
        title: "Flotte Entreprise",
        description: "Solutions de transport professionnel.",
        longDescription:
          "Solutions de transport premium pour les entreprises, hôtels, agences et organisateurs d'événements. Chauffeurs formés, options de facturation mensuelle et flotte moderne. Parfait pour les employés, clients, partenaires et délégations.",
        features: ["Facturation mensuelle", "Flotte dédiée", "Chauffeurs formés", "Service personnalisé"],
      },
      longTerm: {
        title: "Location Longue Durée",
        description: "Forfaits de location mensuels flexibles.",
        longDescription:
          "Louez un véhicule de 1 à 24 mois aux meilleurs tarifs au Maroc. Entretien inclus, assistance complète et véhicule de remplacement disponible. Idéal pour les professionnels, expatriés, étudiants et entreprises.",
        features: ["Entretien inclus", "Véhicule de remplacement", "Tarifs dégressifs", "Flexibilité totale"],
      },
      assistance: {
        title: "Assistance 24/7",
        description: "Aide routière partout, à tout moment.",
        longDescription:
          "Assistance routière complète 24h/24 et 7j/7 : aide en cas de panne, remorquage, support d'urgence, véhicule de remplacement et service client dédié. Voyagez l'esprit tranquille.",
        features: ["Dépannage rapide", "Remorquage", "Véhicule de remplacement", "Support dédié"],
      },

      // SEO
      seoH2: "Location de voitures et services chauffeur premium au Maroc",
      seoP1:
        "Découvrez nos services de location de voitures premium conçus pour les voyageurs, professionnels, familles, entreprises et organisateurs d'événements. Nous offrons une expérience de transport complète à travers le Maroc, incluant Casablanca, Marrakech, Rabat, Tanger, Agadir et Fès. Notre flotte comprend des voitures de luxe, SUV, véhicules d'affaires et options de location longue durée pour chaque besoin.",
      seoH3_1: "Services chauffeur pour affaires et voyages",
      seoP2:
        "Notre service chauffeur assure confort, ponctualité et discrétion. Que vous ayez besoin d'un chauffeur privé pour vos déplacements quotidiens, réunions d'affaires, transferts VIP ou visites guidées, nos chauffeurs professionnels offrent une expérience de service premium.",
      seoH3_2: "Transferts aéroport 24h/24 — Casablanca, Marrakech, Tanger et plus",
      seoP3:
        "Nous proposons des services de transfert aéroport fiables avec suivi des vols en temps réel. Profitez d'un voyage sans stress avec des tarifs fixes, aucun frais caché et une disponibilité 24h/24.",
      seoH3_3: "Location entreprise et solutions véhicules longue durée",
      seoP4:
        "Les entreprises nous font confiance pour les locations mensuelles de véhicules, le transport des employés, les délégations et les services aux invités VIP. Nos forfaits longue durée incluent l'entretien, l'assurance, les véhicules de remplacement et un support dédié.",
      seoH3_4: "Voitures de mariage et transport événementiel",
      seoP5:
        "Rendez votre mariage inoubliable avec nos véhicules de luxe et chauffeurs professionnels. Options de décoration et coordination événementielle disponibles sur demande.",
      seoH3_5: "Assistance routière 24h/24 dans tout le Maroc",
      seoP6:
        "Voyagez l'esprit tranquille grâce à notre service d'assistance routière complet : support en cas de panne, remorquage, aide d'urgence et véhicules de remplacement disponibles à tout moment.",
      seoP7:
        "Engagés envers la qualité, la sécurité et le confort, nos services de location de voitures et de chauffeur se classent parmi les meilleures solutions de transport au Maroc. Que vous soyez visiteur, professionnel ou organisateur d'événement, nous garantissons une expérience de mobilité premium, fluide et personnalisée.",

      // Map section
      mapTag: "Nous trouver",
      mapTitle: "Notre",
      mapTitleSpan: "agence",
      mapDesc: "Visitez notre agence à Casablanca ou bénéficiez de notre service de livraison partout au Maroc.",
      mapReview: "Laisser un avis Google",
      mapDirections: "Itinéraire",
    },
    en: {
      heroTag: "Premium Services in Morocco",
      heroTitle: "Our",
      heroTitleSpan: "Services",
      heroDesc:
        "Premium services tailored to all your needs: private travel, business trips, events, or long-term rentals in Casablanca and across Morocco.",
      showDetails: "Show Details",
      popupClose: "Close",
      bookNow: "Book Now",
      callUs: "Call Us",
      ctaTitle: "Need a",
      ctaTitleSpan: "custom service?",
      ctaDesc:
        "Contact us for a personalized transport solution in Casablanca, Marrakech, Rabat, and across Morocco.",
      trustInsurance: "Insurance included",
      trust247: "Available 24/7",
      trustDelivery: "Airport delivery",
      trustClients: "2000+ happy customers",

      whyTitle: "Why choose our",
      whyTitleSpan: "services?",
      whyDesc:
        "A premium transport experience with exclusive benefits for every client.",
      why1Title: "Modern Fleet",
      why1Desc: "Recent and perfectly maintained vehicles for your comfort and safety.",
      why2Title: "Transparent Pricing",
      why2Desc: "No hidden fees. Clear and competitive rates adapted to all budgets.",
      why3Title: "Nationwide Coverage",
      why3Desc: "Service available in all major Moroccan cities: Casablanca, Rabat, Marrakech, Agadir, Tangier, Fes.",
      why4Title: "24/7 Support",
      why4Desc: "Our team is available around the clock to assist you whenever needed.",

      statsVehicles: "Vehicles",
      statsClients: "Happy Customers",
      statsCities: "Cities Covered",
      statsRating: "Average Rating",

      processTag: "How it works",
      processTitle: "Book in",
      processTitleSpan: "4 simple steps",
      processDesc: "A simple and fast booking process for all our premium services.",
      process1Title: "Choose your service",
      process1Desc: "Select the service that suits your needs: chauffeur, transfer, long-term rental, wedding, or corporate.",
      process2Title: "Define your details",
      process2Desc: "Provide your dates, pick-up location, destination, and any special requests to customize your experience.",
      process3Title: "Confirm and pay",
      process3Desc: "Review your booking and proceed with secure payment. Instant confirmation via email and WhatsApp.",
      process4Title: "Enjoy the service",
      process4Desc: "Your vehicle and/or chauffeur will be waiting at the agreed time and place. Relax and enjoy!",

      testimonialsTag: "Testimonials",
      testimonialsTitle: "What our",
      testimonialsTitleSpan: "clients say",
      testimonials: [
        {
          name: "Ahmed M.",
          role: "Sales Director",
          text: "Fadlo Car's chauffeur service is exceptional. Punctuality, discretion, and high-end vehicles. Perfect for my business trips in Casablanca.",
          rating: 5,
          service: "Chauffeur Service",
        },
        {
          name: "Marie D.",
          role: "French Tourist",
          text: "Flawless airport transfer! The driver was waiting with a sign, the car was clean and comfortable. I recommend 100%.",
          rating: 5,
          service: "Airport Transfer",
        },
        {
          name: "Youssef B.",
          role: "Happy Groom",
          text: "The wedding car was magnificent, perfectly decorated. The driver was very professional. Our day was perfect thanks to Fadlo Car.",
          rating: 5,
          service: "Wedding Car",
        },
        {
          name: "Sarah K.",
          role: "Expat",
          text: "I chose the long-term rental and I'm delighted. Competitive price, maintenance included, and excellent customer service. Thank you Fadlo Car!",
          rating: 5,
          service: "Long-Term Rental",
        },
      ],

      includedTag: "Included in every service",
      includedTitle: "Everything is",
      includedTitleSpan: "included",
      includedDesc: "Every Fadlo Car service includes exclusive benefits for your peace of mind.",
      included1: "Comprehensive insurance",
      included2: "Unlimited mileage",
      included3: "24/7 roadside assistance",
      included4: "Built-in GPS",
      included5: "Regular maintenance",
      included6: "Replacement vehicle",
      included7: "Flexible cancellation",
      included8: "Secure payment",

      coverageTag: "Coverage",
      coverageTitle: "Available across",
      coverageTitleSpan: "all of Morocco",
      coverageDesc: "Our services cover major Moroccan cities and airports for limitless mobility.",
      coverageCities: [
        { name: "Casablanca", airport: "CMN", highlight: true },
        { name: "Marrakech", airport: "RAK", highlight: true },
        { name: "Rabat", airport: "RBA", highlight: false },
        { name: "Tangier", airport: "TNG", highlight: false },
        { name: "Agadir", airport: "AGA", highlight: true },
        { name: "Fes", airport: "FEZ", highlight: false },
        { name: "Oujda", airport: "OUD", highlight: false },
        { name: "Essaouira", airport: "ESU", highlight: false },
      ],

      chauffeur: {
        title: "Chauffeur Service",
        description: "Professional drivers for your journeys.",
        longDescription:
          "Enjoy a premium chauffeur service available throughout Morocco: Casablanca, Marrakech, Rabat, Tangier, Agadir and more. Your private driver guarantees punctuality, safety, comfort and discretion. Ideal for business meetings, VIP transport, personal travel and sightseeing.",
        features: ["Professional chauffeur", "Premium vehicle", "Guaranteed punctuality", "Total discretion"],
      },
      airport: {
        title: "Airport Transfer",
        description: "Fast, reliable and stress-free transfers.",
        longDescription:
          "24/7 airport transfer service with real-time flight tracking. We cover Casablanca CMN, Marrakech RAK, Agadir, Rabat, Tangier, Fes and all Moroccan airports. No waiting fees, fixed pricing and professional drivers.",
        features: ["Flight tracking", "Fixed pricing", "No waiting fees", "24/7 available"],
      },
      wedding: {
        title: "Wedding Cars",
        description: "Luxury vehicles for your special day.",
        longDescription:
          "Make your wedding unforgettable with our elegant luxury cars. Custom decoration available on request, stylish chauffeur and VIP assistance. Available across Morocco for ceremonies, transfers and photoshoots.",
        features: ["Custom decoration", "Stylish chauffeur", "VIP assistance", "Photo sessions"],
      },
      corporate: {
        title: "Corporate Fleet",
        description: "Professional transportation solutions.",
        longDescription:
          "Premium transport solutions for companies, hotels, agencies and event organizations. Trained drivers, monthly billing options and a modern fleet. Perfect for employees, clients, partners and delegations.",
        features: ["Monthly billing", "Dedicated fleet", "Trained drivers", "Custom service"],
      },
      longTerm: {
        title: "Long-Term Rental",
        description: "Flexible monthly rental plans.",
        longDescription:
          "Rent a vehicle from 1 to 24 months at the best rates in Morocco. Maintenance included, full assistance and a replacement vehicle available. Ideal for professionals, expats, students and businesses.",
        features: ["Maintenance included", "Replacement vehicle", "Degressive rates", "Total flexibility"],
      },
      assistance: {
        title: "24/7 Assistance",
        description: "Roadside help anywhere, anytime.",
        longDescription:
          "Complete 24/7 roadside assistance: breakdown help, towing, emergency support, replacement vehicle and dedicated customer service. Travel with total peace of mind.",
        features: ["Fast breakdown help", "Towing", "Replacement vehicle", "Dedicated support"],
      },

      seoH2: "Premium Car Rental & Chauffeur Services in Morocco",
      seoP1:
        "Discover our premium car rental services designed for travelers, professionals, families, companies, and event organizers. We provide a complete transportation experience across Morocco, including Casablanca, Marrakech, Rabat, Tangier, Agadir, and Fès. Our fleet includes luxury cars, SUVs, business vehicles, and long-term rental options for every need.",
      seoH3_1: "Chauffeur Services for Business & Travel",
      seoP2:
        "Our chauffeur service ensures comfort, punctuality, and discretion. Whether you need a private driver for daily commuting, business meetings, VIP transfers, or guided tours, our professional drivers deliver a premium service experience.",
      seoH3_2: "Airport Transfers 24/7 – Casablanca, Marrakech, Tangier & More",
      seoP3:
        "We offer reliable airport transfer services with real-time flight tracking. Enjoy stress-free travel with fixed pricing, no hidden fees, and 24/7 availability.",
      seoH3_3: "Corporate Rental & Long-Term Vehicle Solutions",
      seoP4:
        "Businesses trust us for monthly vehicle rentals, employee transportation, delegations, and VIP guest services. Our long-term rental packages include maintenance, insurance, replacement vehicles, and dedicated support.",
      seoH3_4: "Wedding Cars & Event Transportation",
      seoP5:
        "Make your wedding unforgettable with our luxury vehicles and professional chauffeurs. Decoration options and event coordination are available upon request.",
      seoH3_5: "24/7 Roadside Assistance Across Morocco",
      seoP6:
        "Travel with peace of mind thanks to our complete roadside assistance service: breakdown support, towing, emergency help, and replacement vehicles available anytime.",
      seoP7:
        "Committed to quality, safety, and comfort, our car rental and chauffeur services stand among the best transportation solutions in Morocco. Whether you're a visitor, a business professional, or planning an event, we guarantee a premium, seamless, and personalized mobility experience.",

      mapTag: "Find us",
      mapTitle: "Our",
      mapTitleSpan: "agency",
      mapDesc: "Visit our agency in Casablanca or benefit from our delivery service across Morocco.",
      mapReview: "Leave a Google Review",
      mapDirections: "Directions",
    },
  }

  const s = loc[language] || loc.fr

  const testimonials = s.testimonials || []

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  /* ─── JSON-LD ─── */
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "Fadlo Car",
    description: "Premium car rental and chauffeur services in Casablanca, Morocco.",
    url: "https://fadlocar.com/services",
    telephone: "+212600000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
    areaServed: [
      { "@type": "City", name: "Casablanca" },
      { "@type": "City", name: "Marrakech" },
      { "@type": "City", name: "Rabat" },
      { "@type": "City", name: "Tangier" },
      { "@type": "City", name: "Agadir" },
      { "@type": "City", name: "Fes" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car Rental Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Chauffeur Service" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport Transfer" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Car Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Fleet" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Long-Term Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "24/7 Roadside Assistance" } },
      ],
    },
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <Script
        id="ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />

      {/* ═══════════════════════  HERO  ═══════════════════════ */}
      <section className="relative pt-32 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-red-600/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px]" />

        <FloatingParticles />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2.5 mb-8"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm font-bold tracking-wider uppercase">
                {s.heroTag}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6"
            >
              {s.heroTitle}{" "}
              <span className="relative inline-block">
                <span className="text-red-600">{s.heroTitleSpan}</span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1.5 bg-red-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              {s.heroDesc}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <Link href="/cars">
                <Button
                  size="lg"
                  className="group bg-red-600 hover:bg-red-700 text-white rounded-full px-10 text-lg h-16 shadow-2xl shadow-red-600/30 transition-all duration-500 hover:shadow-red-600/50 hover:scale-105 border-0"
                >
                  {s.bookNow}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <a href="tel:+212661528619">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/5 hover:border-white/40 rounded-full px-10 text-lg h-16 backdrop-blur-sm transition-all duration-500"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {s.callUs}
                </Button>
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {[
                { icon: <Shield className="h-4 w-4" />, text: s.trustInsurance },
                { icon: <Clock className="h-4 w-4" />, text: s.trust247 },
                { icon: <MapPin className="h-4 w-4" />, text: s.trustDelivery },
                { icon: <Star className="h-4 w-4" />, text: s.trustClients },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40 text-sm">
                  <span className="text-red-500">{badge.icon}</span>
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-red-600 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════  STATS  ═══════════════════════ */}
      <section className="py-20" aria-label="Stats">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: <Car className="h-7 w-7" />, value: 20, suffix: "+", label: s.statsVehicles },
              { icon: <Users className="h-7 w-7" />, value: 2000, suffix: "+", label: s.statsClients },
              { icon: <Globe className="h-7 w-7" />, value: 8, suffix: "+", label: s.statsCities },
              { icon: <Star className="h-7 w-7" />, value: 4.8, suffix: "/5", label: s.statsRating },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-black/60 border border-white/5 rounded-2xl p-8 text-center hover:border-red-900/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-500">
                    <span className="text-red-500">{stat.icon}</span>
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2} />
                  </p>
                  <p className="text-white/40 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════  SERVICES GRID  ═══════════════════════ */}
      <section className="py-24 relative" aria-label="Services">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Sparkles className="h-4 w-4" />
              {s.heroTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.heroTitle} <span className="text-red-600">{s.heroTitleSpan}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const serviceData = s[service.id]
              const IconComponent = service.icon

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-black/60 border border-white/5 rounded-3xl p-8 hover:border-red-900/50 transition-all duration-500 overflow-hidden relative h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-900/10 transition-all duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-500">
                        <IconComponent className="h-7 w-7 text-red-500" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">{serviceData.title}</h3>
                      <p className="text-white/40 leading-relaxed mb-4 flex-grow">{serviceData.description}</p>

                      {/* Features list */}
                      {serviceData.features && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {serviceData.features.map((feat, fi) => (
                            <div key={fi} className="flex items-center gap-2 text-white/30 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-red-500 flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="border-red-900/40 text-white hover:bg-red-600/10 hover:border-red-600/60 rounded-xl w-full group/btn transition-all duration-300"
                        onClick={() => setSelected(service)}
                      >
                        {s.showDetails}
                        <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  HOW IT WORKS  ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden" aria-label="Process">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/5 to-black" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Zap className="h-4 w-4" />
              {s.processTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.processTitle} <span className="text-red-600">{s.processTitleSpan}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">{s.processDesc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-red-600/60 via-red-500 to-red-600/60" />

            {[
              { step: "01", icon: <Target className="h-8 w-8" />, title: s.process1Title, desc: s.process1Desc },
              { step: "02", icon: <FileText className="h-8 w-8" />, title: s.process2Title, desc: s.process2Desc },
              { step: "03", icon: <CreditCard className="h-8 w-8" />, title: s.process3Title, desc: s.process3Desc },
              { step: "04", icon: <Key className="h-8 w-8" />, title: s.process4Title, desc: s.process4Desc },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className="bg-black/60 border border-white/5 rounded-3xl p-8 text-center hover:border-red-900/50 transition-all duration-500 h-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="relative mx-auto mb-6">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-600/40 group-hover:scale-110 group-hover:shadow-red-600/60 transition-all duration-500">
                        <span className="text-white">{item.icon}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-9 h-9 bg-black border-2 border-red-600 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-xs font-black">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  WHY CHOOSE US  ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px] -translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Award className="h-4 w-4" />
              {s.whyTitle}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.whyTitle} <span className="text-red-600">{s.whyTitleSpan}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">{s.whyDesc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Car className="h-7 w-7" />, title: s.why1Title, desc: s.why1Desc },
              { icon: <CheckCircle2 className="h-7 w-7" />, title: s.why2Title, desc: s.why2Desc },
              { icon: <MapPin className="h-7 w-7" />, title: s.why3Title, desc: s.why3Desc },
              { icon: <Clock className="h-7 w-7" />, title: s.why4Title, desc: s.why4Desc },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-black/60 border border-white/5 rounded-2xl p-6 text-center hover:border-red-900/50 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-500">
                    <span className="text-red-500">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  INCLUDED FEATURES  ═══════════════════════ */}
      <section className="py-24 relative" aria-label="Included">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <CheckCircle2 className="h-4 w-4" />
              {s.includedTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.includedTitle} <span className="text-red-600">{s.includedTitleSpan}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">{s.includedDesc}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Shield className="h-6 w-6" />, text: s.included1 },
              { icon: <Navigation className="h-6 w-6" />, text: s.included2 },
              { icon: <Tool className="h-6 w-6" />, text: s.included3 },
              { icon: <MapPin className="h-6 w-6" />, text: s.included4 },
              { icon: <Settings className="h-6 w-6" />, text: s.included5 },
              { icon: <Car className="h-6 w-6" />, text: s.included6 },
              { icon: <Calendar className="h-6 w-6" />, text: s.included7 },
              { icon: <CreditCard className="h-6 w-6" />, text: s.included8 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center text-center p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-red-900/40 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-500">
                  <span className="text-red-500">{item.icon}</span>
                </div>
                <p className="text-white/60 text-sm font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  COVERAGE MAP  ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden" aria-label="Coverage">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Globe className="h-4 w-4" />
              {s.coverageTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.coverageTitle} <span className="text-red-600">{s.coverageTitleSpan}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">{s.coverageDesc}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {s.coverageCities.map((city, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-500 text-center overflow-hidden",
                  city.highlight
                    ? "bg-red-600/10 border-red-600/30 hover:border-red-600/60"
                    : "bg-black/40 border-white/5 hover:border-red-900/40"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-500" />
                <div className="relative z-10">
                  <MapPin className={cn(
                    "h-6 w-6 mx-auto mb-3",
                    city.highlight ? "text-red-500" : "text-white/30"
                  )} />
                  <p className="text-white font-bold text-lg">{city.name}</p>
                  <p className="text-white/30 text-xs font-mono mt-1">({city.airport})</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  TESTIMONIALS  ═══════════════════════ */}
      <section className="py-24 relative overflow-hidden" aria-label="Testimonials">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Quote className="h-4 w-4" />
              {s.testimonialsTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.testimonialsTitle} <span className="text-red-600">{s.testimonialsTitleSpan}</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[350px]">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    opacity: activeTestimonial === i ? 1 : 0,
                    scale: activeTestimonial === i ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                  className={activeTestimonial === i ? "block" : "hidden"}
                >
                  <div className="bg-black/60 border border-red-900/30 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
                    <div className="absolute top-6 left-8 text-red-600/10 text-[120px] font-serif leading-none select-none pointer-events-none">
                      &ldquo;
                    </div>
                    <div className="relative z-10">
                      {/* Service badge */}
                      <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-red-400 text-xs font-bold">{testimonial.service}</span>
                      </div>

                      <div className="flex justify-center gap-1 mb-6">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="h-5 w-5 text-red-500 fill-red-500" />
                        ))}
                      </div>
                      <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-10 italic">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-600/30">
                          {testimonial.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-lg">{testimonial.name}</p>
                          <p className="text-white/40 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={cn(
                    "h-3 rounded-full transition-all duration-500",
                    activeTestimonial === i ? "w-12 bg-red-600" : "w-3 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`${s.testimonialsTag} ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════  SEO CONTENT  ═══════════════════════ */}
      <section className="py-24 relative" aria-label="SEO Content">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-8 tracking-tight">
              {s.seoH2}
            </h2>

            <div className="space-y-6">
              <p className="text-white/40 text-lg leading-relaxed">{s.seoP1}</p>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 hover:border-red-900/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
                  <Car className="h-5 w-5" />
                  {s.seoH3_1}
                </h3>
                <p className="text-white/40 leading-relaxed">{s.seoP2}</p>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 hover:border-red-900/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
                  <Plane className="h-5 w-5" />
                  {s.seoH3_2}
                </h3>
                <p className="text-white/40 leading-relaxed">{s.seoP3}</p>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 hover:border-red-900/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
                  <Briefcase className="h-5 w-5" />
                  {s.seoH3_3}
                </h3>
                <p className="text-white/40 leading-relaxed">{s.seoP4}</p>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 hover:border-red-900/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  {s.seoH3_4}
                </h3>
                <p className="text-white/40 leading-relaxed">{s.seoP5}</p>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 hover:border-red-900/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
                  <Tool className="h-5 w-5" />
                  {s.seoH3_5}
                </h3>
                <p className="text-white/40 leading-relaxed">{s.seoP6}</p>
              </div>

              <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-8">
                <p className="text-white/50 leading-relaxed text-lg italic">{s.seoP7}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════  CTA  ═══════════════════════ */}
      <section className="py-24" aria-label="CTA">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-600" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-[100px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative px-8 py-20 md:px-16 md:py-28 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
              >
                {s.ctaTitle}
                <br />
                <span className="text-white/90">{s.ctaTitleSpan}</span>
              </motion.h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">{s.ctaDesc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/cars">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-white/90 rounded-full px-12 h-16 text-lg font-black shadow-2xl shadow-black/30 hover:scale-105 transition-all duration-500 group border-0 uppercase tracking-wider"
                  >
                    {s.bookNow}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
                <a href="tel:+212600000000">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-12 h-16 text-lg transition-all duration-500"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    {s.callUs}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════  MAP  ═══════════════════════ */}
      <section className="py-24 relative" aria-label="Map">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <MapPin className="h-4 w-4" />
              {s.mapTag}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.mapTitle} <span className="text-red-600">{s.mapTitleSpan}</span>
            </h2>
            <p className="text-white/40 text-lg">{s.mapDesc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full h-[450px] rounded-3xl overflow-hidden border border-red-900/30 shadow-2xl shadow-red-900/10"
          >
            <iframe
              title="Fadlo Car — Casablanca"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3590.395180567483!2d-7.654152168275857!3d33.5170286119286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d80fea38c33%3A0x854b1ff0ac87d9aa!2sFaDlo%20Car!5e0!3m2!1sfr!2sma!4v1764389920204!5m2!1sfr!2sma"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 rounded-full text-lg font-bold flex items-center gap-2 shadow-xl shadow-red-600/30 border-0 transition-all duration-500 hover:shadow-red-600/50"
              onClick={() => window.open("https://maps.app.goo.gl/TaXG8nCmjqmScqMR9", "_blank")}
            >
              <Star className="h-5 w-5" />
              {s.mapReview}
            </Button>
            <Button
              variant="outline"
              className="border-red-900/40 text-white hover:bg-red-600/10 hover:border-red-600/60 px-10 py-6 rounded-full text-lg transition-all duration-300"
              onClick={() => window.open("https://maps.app.goo.gl/TaXG8nCmjqmScqMR9", "_blank")}
            >
              <MapPin className="h-5 w-5 mr-2" />
              {s.mapDirections}
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* ═══════════════════════  POPUP DIALOG  ═══════════════════════ */}
      <AnimatePresence>
        {selected && (
          <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className="bg-black border border-red-900/30 text-white max-w-xl rounded-3xl shadow-2xl shadow-red-900/20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-2xl flex items-center justify-center">
                      <selected.icon className="h-7 w-7 text-red-500" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-white">
                      {s[selected.id].title}
                    </DialogTitle>
                  </div>

                  <DialogDescription className="text-white/50 text-base leading-relaxed">
                    {s[selected.id].longDescription}
                  </DialogDescription>
                </DialogHeader>

                {/* Features in popup */}
                {s[selected.id].features && (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {s[selected.id].features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-white/50 text-sm bg-white/5 rounded-xl p-3">
                        <CheckCircle2 className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <Link href="/cars" className="flex-1">
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full border-0 font-bold h-12">
                      {s.bookNow}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-red-900/40 text-white hover:bg-red-600/10 hover:border-red-600/60 rounded-xl transition-all h-12"
                    onClick={() => setSelected(null)}
                  >
                    {s.popupClose}
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  )
}
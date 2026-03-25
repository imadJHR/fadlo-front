"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Search,
  Shield,
  Trophy,
  Headphones,
  Star,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Car,
  Users,
  Award,
  Sparkles,
  Quote,
  Play,
  Zap,
  Heart,
  Globe,
  ChevronDown,
} from "lucide-react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CarCard from "../components/car-card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../components/language-provider";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

/* ──────────────────────────── Animated Counter ──────────────────────────── */
function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ──────────────────────────── Floating Particles ──────────────────────────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
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
                  ? "rgba(255, 255, 255, 0.2)"
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
  );
}

/* ──────────────────────────── Calendar Select ──────────────────────────── */
function CalendarSelect({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
        <CalendarIcon className="h-4 w-4 text-red-500" />
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-black/60 border-red-900/40 text-white w-full justify-start text-left font-normal h-14 rounded-xl hover:bg-black/80 hover:border-red-600/60 transition-all duration-300",
              !value && "text-white/40"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-red-500" />
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-black border-red-900/40 rounded-2xl shadow-2xl shadow-red-900/20"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => date < new Date()}
            className="bg-black text-white rounded-2xl"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ──────────────────────────── FAQ Item ──────────────────────────── */
function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className={cn(
          "border rounded-2xl transition-all duration-500 overflow-hidden",
          isOpen
            ? "border-red-600/50 bg-red-950/20 shadow-lg shadow-red-900/10"
            : "border-white/10 bg-black/40 hover:border-red-900/40"
        )}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 text-left"
          aria-expanded={isOpen}
        >
          <h3 className="text-white font-bold text-lg pr-4">{question}</h3>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500",
              isOpen
                ? "bg-red-600 text-white rotate-180"
                : "bg-white/10 text-white/60"
            )}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-white/60 leading-relaxed">{answer}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*                              HOME PAGE                                   */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { t, language } = useLanguage();
  const router = useRouter();

  const [pickupDate, setPickupDate] = useState(undefined);
  const [returnDate, setReturnDate] = useState(undefined);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  /* ─── JSON-LD: AutoRental ─── */
  const jsonLdBusiness = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "Fadlo Car",
    image: "https://fadlocar.com/hero.png",
    description:
      "Fadlo Car — Agence de location de voitures de luxe et économiques à Casablanca, Maroc. Large flotte, prix compétitifs, service 24h/24.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Mohammed V",
      addressLocality: "Casablanca",
      addressRegion: "Casablanca-Settat",
      postalCode: "20000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5170286119286,
      longitude: -7.654152168275857,
    },
    url: "https://fadlocar.com",
    telephone: "+212600000000",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "22:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/fadlocar",
      "https://www.instagram.com/fadlocar",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "320",
    },
  };

  /* ─── FAQ data per language ─── */
  const faqData = {
    fr: [
      {
        question:
          "Comment louer une voiture chez Fadlo Car à Casablanca ?",
        answer:
          "Vous pouvez réserver en ligne sur notre site fadlocar.com, par téléphone, ou directement dans notre agence à Casablanca. Choisissez vos dates, sélectionnez votre véhicule et confirmez votre réservation en quelques clics.",
      },
      {
        question:
          "Quels documents sont nécessaires pour la location ?",
        answer:
          "Vous aurez besoin d'un permis de conduire valide (minimum 2 ans), d'une pièce d'identité ou passeport, et d'une carte bancaire pour la caution.",
      },
      {
        question:
          "Proposez-vous la livraison du véhicule à l'aéroport ?",
        answer:
          "Oui, nous proposons la livraison et la récupération de votre véhicule à l'aéroport Mohammed V de Casablanca ainsi qu'à votre hôtel ou domicile.",
      },
      {
        question: "Les véhicules sont-ils assurés ?",
        answer:
          "Tous nos véhicules disposent d'une assurance tous risques. Des options d'assurance complémentaire sont également disponibles.",
      },
    ],
    en: [
      {
        question: "How can I rent a car from Fadlo Car in Casablanca?",
        answer:
          "You can book online on our website fadlocar.com, by phone, or directly at our agency in Casablanca. Choose your dates, select your vehicle, and confirm your reservation in just a few clicks.",
      },
      {
        question: "What documents are required for rental?",
        answer:
          "You will need a valid driving license (minimum 2 years), an ID card or passport, and a credit card for the deposit.",
      },
      {
        question: "Do you offer vehicle delivery to the airport?",
        answer:
          "Yes, we offer delivery and pick-up of your vehicle at Mohammed V Airport in Casablanca, as well as to your hotel or home.",
      },
      {
        question: "Are the vehicles insured?",
        answer:
          "All our vehicles come with comprehensive insurance. Additional insurance options are also available.",
      },
    ],
  };

  const currentFAQ = faqData[language] || faqData.fr;

  /* ─── JSON-LD: FAQPage (always French for structured data) ─── */
  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.fr.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  /* ─── JSON-LD: WebSite ─── */
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fadlo Car",
    url: "https://fadlocar.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fadlocar.com/cars?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  /* ─── Testimonials per language ─── */
  const testimonialsData = {
    fr: [
      {
        name: "Mohammed A.",
        role: "Client régulier",
        text: "Service exceptionnel ! La voiture était impeccable et le personnel très professionnel. Je recommande vivement Fadlo Car pour toute location à Casablanca.",
        rating: 5,
      },
      {
        name: "Sophie L.",
        role: "Touriste française",
        text: "Meilleure expérience de location au Maroc. Prix imbattables et véhicules en parfait état. La livraison à l'aéroport était un vrai plus !",
        rating: 5,
      },
      {
        name: "Karim B.",
        role: "Homme d'affaires",
        text: "Je loue régulièrement chez Fadlo Car pour mes déplacements professionnels. Fiabilité, ponctualité et élégance — exactement ce qu'il me faut.",
        rating: 5,
      },
    ],
    en: [
      {
        name: "Mohammed A.",
        role: "Regular Client",
        text: "Exceptional service! The car was spotless and the staff very professional. I highly recommend Fadlo Car for any rental in Casablanca.",
        rating: 5,
      },
      {
        name: "Sophie L.",
        role: "French Tourist",
        text: "Best rental experience in Morocco. Unbeatable prices and vehicles in perfect condition. Airport delivery was a huge bonus!",
        rating: 5,
      },
      {
        name: "Karim B.",
        role: "Businessman",
        text: "I regularly rent from Fadlo Car for my business trips. Reliability, punctuality, and elegance — exactly what I need.",
        rating: 5,
      },
    ],
  };

  const testimonials = testimonialsData[language] || testimonialsData.fr;

  /* ─── Localized static strings ─── */
  const localStrings = {
    fr: {
      tagline: "#1 Location Voiture Casablanca",
      insurance: "Assurance incluse",
      reviews: "320+ avis clients",
      available247: "Disponible 24/7",
      airportDelivery: "Livraison aéroport",
      startingFrom: "À partir de",
      pricePerDay: "25 €/j",
      premiumSelection: "Sélection premium",
      viewAll: "Voir tout",
      simpleAndFast: "Simple & rapide",
      howItWorksTitle: "Comment ça",
      howItWorksSpan: "marche ?",
      howItWorksDesc:
        "Louez votre voiture en 3 étapes simples. Aucune paperasse compliquée, tout se fait en ligne.",
      step1Title: "Choisissez votre voiture",
      step1Desc:
        "Parcourez notre flotte et sélectionnez le véhicule qui correspond à vos besoins et votre budget.",
      step2Title: "Réservez vos dates",
      step2Desc:
        "Indiquez vos dates de prise en charge et de retour. Confirmation instantanée par email et WhatsApp.",
      step3Title: "Profitez de la route",
      step3Desc:
        "Récupérez votre véhicule à notre agence, à l'aéroport ou recevez-le directement à votre adresse.",
      ourFleet: "Notre flotte",
      allVehiclesTitle: "Tous nos",
      allVehiclesSpan: "véhicules",
      allVehiclesDesc:
        "Découvrez notre gamme complète de véhicules : économiques, berlines, SUV et voitures de luxe.",
      viewMoreVehicles: "Voir plus de véhicules",
      ourAdvantages: "Nos avantages",
      whyChoose: "Pourquoi choisir",
      fadloCarQuestion: "Fadlo Car ?",
      advantagesDesc:
        "Des avantages exclusifs qui font la différence pour votre expérience de location.",
      freeDelivery: "Livraison gratuite",
      freeDeliveryDesc:
        "Livraison et récupération du véhicule à l'aéroport Mohammed V ou à votre hôtel, sans frais supplémentaires.",
      available247Feature: "Disponible 24/7",
      available247Desc:
        "Notre équipe est joignable à toute heure, 7 jours sur 7, pour répondre à vos besoins et urgences.",
      satisfactionGuaranteed: "Satisfaction garantie",
      satisfactionDesc:
        "Plus de 2000 clients satisfaits. Nous mettons tout en œuvre pour une expérience irréprochable.",
      testimonialsLabel: "Témoignages",
      whatClientsSay: "Ce que disent nos",
      clientsSpan: "clients",
      partnerBrands: "Marques partenaires",
      faqLabel: "FAQ",
      questionsTitle: "Questions",
      questionsSpan: "fréquentes",
      ctaTitle: "Prêt à prendre",
      ctaTitleLine2: "la route ?",
      ctaDesc:
        "Réservez votre voiture en quelques clics et profitez d'une expérience de conduite inoubliable à Casablanca et dans tout le Maroc.",
      bookNowCta: "Réserver maintenant",
      callUs: "Appelez-nous",
      locationLabel: "Localisation",
      locationDesc:
        "Retrouvez-nous facilement à Casablanca. Livraison possible dans toute la ville.",
      directions: "Itinéraire",
      selectDate: "Sélectionner une date",
      seoExtraP:
        "Fadlo Car est votre partenaire de confiance pour la location de voiture à Casablanca. Que vous cherchiez une voiture économique pour vos déplacements quotidiens, un SUV spacieux pour un voyage en famille, ou une voiture de luxe pour un événement spécial, notre flotte variée répond à tous vos besoins. Profitez de tarifs compétitifs, d'une assurance tous risques incluse et d'un service client disponible 24h/24.",
      statsVehicles: "Véhicules",
      statsClients: "Clients satisfaits",
      statsExperience: "Années d'expérience",
      statsRating: "Note moyenne",
    },
    en: {
      tagline: "#1 Car Rental in Casablanca",
      insurance: "Insurance included",
      reviews: "320+ client reviews",
      available247: "Available 24/7",
      airportDelivery: "Airport delivery",
      startingFrom: "Starting from",
      pricePerDay: "25 €/day",
      premiumSelection: "Premium selection",
      viewAll: "View all",
      simpleAndFast: "Simple & fast",
      howItWorksTitle: "How does it",
      howItWorksSpan: "work?",
      howItWorksDesc:
        "Rent your car in 3 simple steps. No complicated paperwork, everything is done online.",
      step1Title: "Choose your car",
      step1Desc:
        "Browse our fleet and select the vehicle that matches your needs and budget.",
      step2Title: "Book your dates",
      step2Desc:
        "Enter your pick-up and return dates. Instant confirmation via email and WhatsApp.",
      step3Title: "Enjoy the road",
      step3Desc:
        "Pick up your vehicle at our agency, at the airport, or have it delivered directly to your address.",
      ourFleet: "Our fleet",
      allVehiclesTitle: "All our",
      allVehiclesSpan: "vehicles",
      allVehiclesDesc:
        "Discover our complete range of vehicles: economy, sedans, SUVs, and luxury cars.",
      viewMoreVehicles: "View more vehicles",
      ourAdvantages: "Our advantages",
      whyChoose: "Why choose",
      fadloCarQuestion: "Fadlo Car?",
      advantagesDesc:
        "Exclusive benefits that make the difference for your rental experience.",
      freeDelivery: "Free delivery",
      freeDeliveryDesc:
        "Vehicle delivery and pick-up at Mohammed V Airport or your hotel, at no extra cost.",
      available247Feature: "Available 24/7",
      available247Desc:
        "Our team is reachable at any time, 7 days a week, to meet your needs and emergencies.",
      satisfactionGuaranteed: "Satisfaction guaranteed",
      satisfactionDesc:
        "Over 2000 satisfied clients. We do everything to ensure a flawless experience.",
      testimonialsLabel: "Testimonials",
      whatClientsSay: "What our",
      clientsSpan: "clients say",
      partnerBrands: "Partner brands",
      faqLabel: "FAQ",
      questionsTitle: "Frequently asked",
      questionsSpan: "questions",
      ctaTitle: "Ready to hit",
      ctaTitleLine2: "the road?",
      ctaDesc:
        "Book your car in just a few clicks and enjoy an unforgettable driving experience in Casablanca and throughout Morocco.",
      bookNowCta: "Book now",
      callUs: "Call us",
      locationLabel: "Location",
      locationDesc:
        "Find us easily in Casablanca. Delivery available throughout the city.",
      directions: "Directions",
      selectDate: "Select a date",
      seoExtraP:
        "Fadlo Car is your trusted partner for car rental in Casablanca. Whether you're looking for an economy car for daily commutes, a spacious SUV for a family trip, or a luxury car for a special event, our diverse fleet meets all your needs. Enjoy competitive rates, comprehensive insurance included, and 24/7 customer service.",
      statsVehicles: "Vehicles",
      statsClients: "Happy customers",
      statsExperience: "Years of experience",
      statsRating: "Average rating",
    },
  };

  const s = localStrings[language] || localStrings.fr;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  /* ─── Fetch Vehicles ─── */
  useEffect(() => {
    const API =
      "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules";
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const featured = (data.vehicules || []).filter(
          (c) => c.vedette && c.disponible
        );
        setFeaturedCars(featured);
        setAllCars((data.vehicules || []).slice(0, 6));
      })
      .catch(console.error);
  }, []);

  /* ─── Fetch Brands ─── */
  useEffect(() => {
    const API =
      "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/brands";
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setBrands(data.brands || []);
      })
      .catch(console.error);
  }, []);

  const getImageUrl = (src) => {
    if (!src || typeof src !== "string") return "/placeholder-car.jpg";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("//")) return `https:${src}`;
    return `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${src.replace(/^\/+/, "")}`;
  };

  /* ════════════════════════════  RENDER  ════════════════════════════ */
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* ─── Structured Data ─── */}
      <Script
        id="ld-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />

      {/* ═══════════════════════  HERO  ═══════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        aria-label="Accueil — Location de voitures Casablanca"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[200%] h-32 bg-gradient-to-r from-transparent via-red-600/5 to-transparent rotate-[-15deg]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[200%] h-32 bg-gradient-to-r from-transparent via-red-600/5 to-transparent rotate-[-15deg]" />
        </div>

        <FloatingParticles />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 relative z-10 pt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2.5"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-sm font-bold tracking-wider uppercase">
                  {s.tagline}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tighter"
              >
                {t.hero.title}{" "}
                <span className="relative inline-block">
                  <span className="text-red-600">{t.hero.titleSpan}</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1.5 bg-red-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{ transformOrigin: "left" }}
                  />
                </span>{" "}
                <span className="text-white/90">{t.hero.titleSuffix}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-white/50 max-w-lg leading-relaxed"
              >
                {t.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/cars" aria-label={s.bookNowCta}>
                  <Button
                    size="lg"
                    className="group bg-red-600 hover:bg-red-700 text-white rounded-full px-10 text-lg h-16 shadow-2xl shadow-red-600/30 transition-all duration-500 hover:shadow-red-600/50 hover:scale-105 border-0"
                  >
                    {t.nav.bookNow}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>

                <Link href="/cars" aria-label={t.hero.viewFleet}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/5 hover:border-white/40 rounded-full px-10 text-lg h-16 backdrop-blur-sm transition-all duration-500"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {t.hero.viewFleet}
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-8 pt-6 border-t border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 text-red-500 fill-red-500"
                        />
                      ))}
                    </div>
                    <p className="text-white/40 text-xs font-medium">
                      {s.reviews}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{s.insurance}</span>
                </div>
              </motion.div>
            </div>

            {/* Right column — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-red-600/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-red-500/15 rounded-full blur-[60px]" />

                <Image
                  src="/hero.png"
                  alt="Location voiture de luxe Casablanca — Fadlo Car"
                  fill
                  className="object-contain drop-shadow-[0_20px_80px_rgba(220,38,38,0.4)] hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl border border-red-900/40 rounded-2xl p-4 shadow-2xl shadow-red-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {s.available247}
                    </p>
                    <p className="text-white/40 text-xs">
                      {s.airportDelivery}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-8 right-4 bg-black/80 backdrop-blur-xl border border-red-900/40 rounded-2xl p-4 shadow-2xl shadow-red-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium">
                      {s.startingFrom}
                    </p>
                    <p className="text-red-500 text-xl font-black">
                      {s.pricePerDay}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

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

      {/* ═══════════════════════  SEARCH BAR  ═══════════════════════ */}
      <section className="relative z-20 -mt-16 mb-24 px-4" aria-label="Search">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-black/80 backdrop-blur-2xl border border-red-900/30 shadow-2xl shadow-red-900/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
              <CardContent className="p-8 relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const p = new URLSearchParams();
                    if (pickupDate) p.set("pickup", pickupDate.toISOString());
                    if (returnDate) p.set("return", returnDate.toISOString());
                    router.push(`/cars?${p.toString()}`);
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
                >
                  <CalendarSelect
                    label={t.search.pickupDate}
                    value={pickupDate}
                    onChange={setPickupDate}
                    placeholder={s.selectDate}
                  />
                  <CalendarSelect
                    label={t.search.returnDate}
                    value={returnDate}
                    onChange={setReturnDate}
                    placeholder={s.selectDate}
                  />

                  <Button
                    type="submit"
                    className="h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl text-base font-bold shadow-lg shadow-red-600/30 transition-all hover:shadow-xl hover:shadow-red-600/40 border-0 uppercase tracking-wider"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {t.search.findCar}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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
              {
                icon: <Car className="h-7 w-7" />,
                value: 50,
                suffix: "+",
                label: s.statsVehicles,
              },
              {
                icon: <Users className="h-7 w-7" />,
                value: 2000,
                suffix: "+",
                label: s.statsClients,
              },
              {
                icon: <Globe className="h-7 w-7" />,
                value: 5,
                suffix: "+",
                label: s.statsExperience,
              },
              {
                icon: <Star className="h-7 w-7" />,
                value: 4.8,
                suffix: "/5",
                label: s.statsRating,
              },
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
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </p>
                  <p className="text-white/40 text-sm font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════  FEATURED CARS  ═══════════════════════ */}
      <section className="py-24 relative" aria-labelledby="featured-title">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
                <Sparkles className="h-4 w-4" />
                {s.premiumSelection}
              </span>
              <h2
                id="featured-title"
                className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight"
              >
                {t.featured.title}{" "}
                <span className="text-red-600">{t.featured.titleSpan}</span>
              </h2>
              <p className="text-white/40 mt-4 max-w-xl text-lg">
                {t.featured.description}
              </p>
            </div>

            <Link href="/cars">
              <Button
                variant="outline"
                className="border-red-900/40 text-white hover:bg-red-600/10 hover:border-red-600/60 rounded-full px-8 group transition-all duration-300"
              >
                {s.viewAll}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, index) => (
              <CarCard
                key={car._id}
                car={{
                  ...car,
                  name: car.nom,
                  price: car.prixParJour,
                  slug: car.slug,
                  type: car.type,
                  specifications: car.specifications,
                  image: getImageUrl(car.images?.[0]),
                }}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  HOW IT WORKS  ═══════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        aria-labelledby="how-it-works-title"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/5 to-black" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Zap className="h-4 w-4" />
              {s.simpleAndFast}
            </span>
            <h2
              id="how-it-works-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {s.howItWorksTitle}{" "}
              <span className="text-red-600">{s.howItWorksSpan}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">
              {s.howItWorksDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-28 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-red-600/60 via-red-500 to-red-600/60" />

            {[
              {
                step: "01",
                icon: <Search className="h-8 w-8" />,
                title: s.step1Title,
                desc: s.step1Desc,
              },
              {
                step: "02",
                icon: <CalendarIcon className="h-8 w-8" />,
                title: s.step2Title,
                desc: s.step2Desc,
              },
              {
                step: "03",
                icon: <Car className="h-8 w-8" />,
                title: s.step3Title,
                desc: s.step3Desc,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="bg-black/60 border border-white/5 rounded-3xl p-10 text-center hover:border-red-900/50 transition-all duration-500 h-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="relative mx-auto mb-8">
                      <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-600/40 group-hover:scale-110 group-hover:shadow-red-600/60 transition-all duration-500">
                        <span className="text-white">{item.icon}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-black border-2 border-red-600 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-xs font-black">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/40 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  ALL VEHICLES  ═══════════════════════ */}
      <section className="py-24 relative" aria-labelledby="all-vehicles-title">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Car className="h-4 w-4" />
              {s.ourFleet}
            </span>
            <h2
              id="all-vehicles-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {s.allVehiclesTitle}{" "}
              <span className="text-red-600">{s.allVehiclesSpan}</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl">
              {s.allVehiclesDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCars.map((car, index) => (
              <CarCard
                key={car._id}
                car={{
                  ...car,
                  name: car.nom,
                  price: car.prixParJour,
                  slug: car.slug,
                  type: car.type,
                  specifications: car.specifications,
                  image: getImageUrl(car.images?.[0]),
                }}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-14"
          >
            <Link href="/cars">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-14 py-7 rounded-full text-lg font-bold shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all group border-0 uppercase tracking-wider">
                {s.viewMoreVehicles}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════  FEATURES  ═══════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        aria-label={s.ourAdvantages}
      >
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px] -translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Award className="h-4 w-4" />
              {s.ourAdvantages}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {s.whyChoose}{" "}
              <span className="text-red-600">{s.fadloCarQuestion}</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">
              {s.advantagesDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Trophy className="h-7 w-7" />,
                title: t.features.quality.title,
                desc: t.features.quality.description,
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: t.features.secure.title,
                desc: t.features.secure.description,
              },
              {
                icon: <Headphones className="h-7 w-7" />,
                title: t.features.support.title,
                desc: t.features.support.description,
              },
              {
                icon: <MapPin className="h-7 w-7" />,
                title: s.freeDelivery,
                desc: s.freeDeliveryDesc,
              },
              {
                icon: <Clock className="h-7 w-7" />,
                title: s.available247Feature,
                desc: s.available247Desc,
              },
              {
                icon: <Heart className="h-7 w-7" />,
                title: s.satisfactionGuaranteed,
                desc: s.satisfactionDesc,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-black/60 border border-white/5 rounded-3xl p-8 hover:border-red-900/50 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-900/10 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-500">
                    <span className="text-red-500">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  TESTIMONIALS  ═══════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        aria-labelledby="testimonials-title"
      >
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
              {s.testimonialsLabel}
            </span>
            <h2
              id="testimonials-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {s.whatClientsSay}{" "}
              <span className="text-red-600">{s.clientsSpan}</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[320px]">
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
                      <div className="flex justify-center gap-1 mb-8">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, j) => (
                            <Star
                              key={j}
                              className="h-5 w-5 text-red-500 fill-red-500"
                            />
                          )
                        )}
                      </div>
                      <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-10 italic">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-600/30">
                          {testimonial.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-lg">
                            {testimonial.name}
                          </p>
                          <p className="text-white/40 text-sm">
                            {testimonial.role}
                          </p>
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
                    activeTestimonial === i
                      ? "w-12 bg-red-600"
                      : "w-3 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`${s.testimonialsLabel} ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════  BRANDS  ═══════════════════════ */}
      <section
        className="py-24 overflow-hidden"
        aria-labelledby="brands-title"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Award className="h-4 w-4" />
              {s.partnerBrands}
            </span>
            <h2
              id="brands-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {t.brands.title}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">
              {t.brands.description}
            </p>
          </motion.div>

          <div className="relative w-full overflow-hidden py-6">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <motion.div
              className="flex gap-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              }}
            >
              {[...brands, ...brands, ...brands, ...brands].map(
                (brand, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 cursor-pointer group"
                    onClick={() =>
                      router.push(
                        `/cars?brand=${encodeURIComponent(brand.title)}`
                      )
                    }
                  >
                    <div className="w-28 h-28 bg-black/60 border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-red-600/50 group-hover:bg-red-600/5 transition-all duration-500 group-hover:scale-110">
                      <img
                        src={getImageUrl(brand.image)}
                        alt={`${brand.title} — Fadlo Car`}
                        className="w-16 h-16 object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-white/40 group-hover:text-white mt-3 font-semibold text-sm transition-colors duration-300">
                      {brand.title}
                    </p>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════  FAQ  ═══════════════════════ */}
      <section className="py-24 relative" aria-labelledby="faq-title">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">
              <Headphones className="h-4 w-4" />
              {s.faqLabel}
            </span>
            <h2
              id="faq-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {s.questionsTitle}{" "}
              <span className="text-red-600">{s.questionsSpan}</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {currentFAQ.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════  SEO TEXT  ═══════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        aria-labelledby="seo-title"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              id="seo-title"
              className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight"
            >
              {t.seo.title}
            </h2>

            <div className="text-white/40 text-lg leading-relaxed space-y-4">
              <p>{t.seo.description}</p>
              <p>{s.seoExtraP}</p>
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
                {s.ctaTitleLine2}
              </motion.h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                {s.ctaDesc}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/cars">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-white/90 rounded-full px-12 h-16 text-lg font-black shadow-2xl shadow-black/30 hover:scale-105 transition-all duration-500 group border-0 uppercase tracking-wider"
                  >
                    {s.bookNowCta}
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
      <section className="py-24 relative" aria-labelledby="location-title">
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
              {s.locationLabel}
            </span>
            <h2
              id="location-title"
              className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              {t.location.title}
            </h2>
            <p className="text-white/40 text-lg">{s.locationDesc}</p>
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
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/TaXG8nCmjqmScqMR9",
                  "_blank"
                )
              }
            >
              <Star className="h-5 w-5" />
              {t.location.reviewBtn}
            </Button>

            <Button
              variant="outline"
              className="border-red-900/40 text-white hover:bg-red-600/10 hover:border-red-600/60 px-10 py-6 rounded-full text-lg transition-all duration-300"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/TaXG8nCmjqmScqMR9",
                  "_blank"
                )
              }
            >
              <MapPin className="h-5 w-5 mr-2" />
              {s.directions}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
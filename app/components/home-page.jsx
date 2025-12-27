"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Search,
  Shield,
  Trophy,
  Headphones,
  Star,
} from "lucide-react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CarCard from "../components/car-card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../components/language-provider";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [brands, setBrands] = useState([]);

  const { t } = useLanguage();
  const router = useRouter();

  const [pickupDate, setPickupDate] = useState();
  const [returnDate, setReturnDate] = useState();

  /* ----------------------------------------------------
        FETCH VEHICLES
  ---------------------------------------------------- */
  useEffect(() => {
    const API_URL =
      "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules";

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        const featured = (data.vehicules || []).filter(
          (car) => car.vedette === true && car.disponible === true
        );

        setFeaturedCars(featured);
        setAllCars((data.vehicules || []).slice(0, 6));
      })
      .catch((err) => console.error("Erreur API véhicules :", err));
  }, []);

  /* ----------------------------------------------------
        FETCH BRANDS
  ---------------------------------------------------- */
  useEffect(() => {
    const API_URL =
      "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/brands";

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBrands(data.brands || []);
      })
      .catch((err) => console.error("Erreur API marques :", err));
  }, []);

  /* ----------------------------------------------------
        FORMAT IMAGE URLs
        ✅ Supports Cloudinary full URLs + old local paths
  ---------------------------------------------------- */
  const getImageUrl = (img) => {
    if (!img) return "/placeholder-car.jpg";
    if (typeof img !== "string") return "/placeholder-car.jpg";

    // Cloudinary (or any absolute URL)
    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    // protocol-relative URL
    if (img.startsWith("//")) return `https:${img}`;

    // old mode: local path served by your backend (if you still have some old records)
    return `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${img.replace(
      /^\/+/,
      ""
    )}`;
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {t.hero.title}{" "}
                <span className="text-primary">{t.hero.titleSpan}</span>{" "}
                {t.hero.titleSuffix}
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                {t.hero.description}
              </p>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-lg h-14"
                >
                  {t.nav.bookNow}
                </Button>

                <Link href="/cars">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 rounded-full px-8 text-lg h-14"
                  >
                    {t.hero.viewFleet}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-[300px] lg:h-[400px] w-full">
                <Image
                  src="/hero.png"
                  alt="Luxury Car"
                  fill
                  className="object-contain drop-shadow-[0_20px_60px_rgba(255,0,0,0.35)]"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-primary/10 to-transparent blur-3xl -z-10"></div>
      </section>

      {/* SEARCH SECTION */}
      <section className="relative z-20 -mt-10 mb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-primary/10">
              <CardContent className="p-6 lg:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams();

                    if (pickupDate) params.set("pickup", pickupDate.toISOString());
                    if (returnDate) params.set("return", returnDate.toISOString());

                    router.push(`/cars?${params.toString()}`);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                  <CalendarSelect
                    label={t.search.pickupDate}
                    value={pickupDate}
                    onChange={setPickupDate}
                  />

                  <CalendarSelect
                    label={t.search.returnDate}
                    value={returnDate}
                    onChange={setReturnDate}
                  />

                  <div className="flex items-end">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                      <Search className="h-4 w-4 mr-2" />
                      {t.search.findCar}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t.featured.title}{" "}
              <span className="text-primary">{t.featured.titleSpan}</span>
            </h2>
            <p className="text-gray-400">{t.featured.description}</p>
          </div>

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

      {/* ALL VEHICLES */}
      <section className="py-20 bg-black/70">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Tous Nos <span className="text-primary">Véhicules</span>
          </h2>

          <p className="text-gray-400 mb-10">
            Découvrez toute notre flotte, disponible ou non.
          </p>

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

          <div className="flex justify-center mt-10">
            <Link href="/cars">
              <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-full text-lg">
                Voir Plus de Véhicules →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title={t.features.quality.title}
              desc={t.features.quality.description}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title={t.features.secure.title}
              desc={t.features.secure.description}
            />
            <FeatureCard
              icon={<Headphones className="h-8 w-8" />}
              title={t.features.support.title}
              desc={t.features.support.description}
            />
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-20 bg-black/60 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t.brands.title}
          </motion.h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            {t.brands.description}
          </p>

          <div className="relative w-full overflow-hidden py-4">
            <motion.div
              className="flex gap-12"
              initial={{ x: 0 }}
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 18,
                ease: "linear",
              }}
            >
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() =>
                    router.push(`/cars?brand=${encodeURIComponent(brand.title)}`)
                  }
                >
                  <div className="w-28 h-28 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-primary/20 transition-all">
                    <img
                      src={getImageUrl(brand.image)}
                      alt={brand.title}
                      className="w-20 h-20 object-contain opacity-90 hover:opacity-100 transition-all duration-300"
                    />
                  </div>

                  <p className="text-white mt-2 font-medium text-sm">
                    {brand.title}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-white mb-6"
          >
            {t.seo.title}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-gray-400 max-w-3xl mx-auto mb-10"
          >
            {t.seo.description}
          </motion.p>
        </div>
      </section>

      {/* MAP */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            {t.location.title}
          </h2>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3590.395180567483!2d-7.654152168275857!3d33.5170286119286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d80fea38c33%3A0x854b1ff0ac87d9aa!2sFaDlo%20Car!5e0!3m2!1sfr!2sma!4v1764389920204!5m2!1sfr!2sma"
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg flex items-center gap-2"
              onClick={() =>
                window.open("https://maps.app.goo.gl/TaXG8nCmjqmScqMR9", "_blank")
              }
            >
              <Star className="h-5 w-5" />
              {t.location.reviewBtn}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* COMPONENT: CALENDAR */
function CalendarSelect({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-primary" />
        {label}
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-white/5 border-white/10 text-white w-full justify-start text-left font-normal",
              !value && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            className="bg-black text-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* COMPONENT: FEATURE CARD */
function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-primary/50 text-center transition"
    >
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </motion.div>
  );
}
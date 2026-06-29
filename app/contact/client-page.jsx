"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../components/language-provider";
import { motion } from "framer-motion";

const contactCards = [
  {
    icon: MapPin,
    title: "Casablanca",
    text: "Sidi Maarouf, Casablanca",
    subtext: "Livraison possible aeroport, hotel et domicile",
  },
  {
    icon: Phone,
    title: "Telephone",
    text: "+212661528619",
    subtext: "Reponse rapide pour reservations et devis",
  },
  {
    icon: Mail,
    title: "Email",
    text: "fadlocarmaroc@gmail.com",
    subtext: "Demandes pro, longue duree et assistance",
  },
];

const trustPoints = [
  "Reservation rapide et confirmation claire",
  "Accompagnement aeroport Mohammed V",
  "Support client 7j/7 pour vos demandes urgentes",
];

export default function ContactClientPage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const res = await fetch(
        "https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Contact error:", err);
    }

    setLoadingSubmit(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.16),transparent_34%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="container relative mx-auto">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-red-300">
                <MessageCircle className="h-3.5 w-3.5" />
                Contact premium Casablanca
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                {t.contactPage.title} <span className="text-primary">{t.contactPage.titleSpan}</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
                {t.contactPage.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-medium text-white/82 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mb-3 h-5 w-5 text-red-400" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="tel:+212661528619">
                  <Button className="h-12 rounded-full bg-red-600 px-6 font-bold text-white hover:bg-red-700">
                    <Phone className="mr-2 h-4 w-4" />
                    {t.contactPage.callUs}
                  </Button>
                </a>
                <a
                  href="https://wa.me/212661528619?text=Bonjour%2C%20je%20veux%20des%20informations%20sur%20la%20location%20de%20voiture."
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/15 bg-white/[0.03] px-6 font-semibold text-white hover:bg-white/[0.06]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              className="relative"
            >
              <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-red-600/20 blur-3xl" />
              <div className="absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(19,19,21,0.95),rgba(9,9,11,0.9))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {contactCards.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                      >
                        <Card className="h-full rounded-3xl border-white/8 bg-white/[0.035] backdrop-blur-sm transition-all duration-300 hover:border-red-600/40 hover:bg-white/[0.05]">
                          <CardContent className="p-5 sm:p-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-600/20 bg-red-600/10 text-red-400">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{item.title}</h3>
                            <p className="mt-2 text-base font-semibold text-white/92">{item.text}</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/50">{item.subtext}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[28px] border border-white/8 bg-black/35 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Disponibilite</p>
                      <p className="mt-2 text-xl font-bold text-white">Reponse rapide pour reservation, devis et assistance</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-white/72">
                        <Clock className="h-4 w-4 text-red-400" />
                        7j/7 • 09:00 a 22:00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 sm:px-6 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(17,17,19,0.96),rgba(10,10,12,0.9))] shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
          >
            <div className="border-b border-white/8 px-6 py-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Point de contact</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Parlons de votre besoin
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/56">
                Que vous cherchiez une location courte duree, un vehicule premium, une livraison aeroport ou une solution entreprise, notre equipe vous repond rapidement.
              </p>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Agence et livraisons</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/56">
                      Sidi Maarouf, Casablanca. Livraison possible a l’aeroport Mohammed V, en centre-ville, a votre hotel ou directement a domicile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Delais de reponse</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/56">
                      Reponse prioritaire pour les demandes de reservation, transferts aeroport et besoins urgents. WhatsApp et telephone sont les canaux les plus rapides.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/8 bg-black/40">
                <iframe
                  title="Fadlo Car Casablanca"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3590.395180567483!2d-7.654152168275857!3d33.5170286119286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d80fea38c33%3A0x854b1ff0ac87d9aa!2sFaDlo%20Car!5e0!3m2!1sfr!2sma!4v1764389920204!5m2!1sfr!2sma"
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(17,17,19,0.96),rgba(10,10,12,0.9))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-8 md:p-10"
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Formulaire direct</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {t.contactPage.formTitle}
                </h2>
              </div>
              <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-200">
                Reponse moyenne en quelques heures
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-white/72">{t.contactPage.name}</label>
                  <Input
                    className="mt-2 h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/72">{t.contactPage.email}</label>
                  <Input
                    className="mt-2 h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
                    placeholder="john@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/72">{t.contactPage.message}</label>
                <Textarea
                  className="mt-2 min-h-[170px] rounded-3xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
                  placeholder={t.contactPage.description}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-sm leading-relaxed text-white/45">
                  Donne-nous ton besoin, tes dates, ton type de vehicule ou ton point de livraison. Cela nous aide a te repondre plus vite.
                </p>
                <Button
                  className="h-12 rounded-full bg-red-600 px-7 text-base font-bold text-white hover:bg-red-700"
                  type="submit"
                  disabled={loadingSubmit}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {loadingSubmit ? t.contactPage.sending : t.contactPage.sendMessage}
                  {!loadingSubmit && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-sm font-medium text-emerald-300"
                >
                  {t.contactPage.successMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
        <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,90,54,0.14),rgba(10,10,12,0.94))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">Excellence Fadlo Car</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                {t.contactPage.excellence.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                {t.contactPage.excellence.intro}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-lg font-bold text-white">{t.contactPage.excellence.item1Title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.contactPage.excellence.item1Desc}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-lg font-bold text-white">{t.contactPage.excellence.item2Title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.contactPage.excellence.item2Desc}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-lg font-bold text-white">{t.contactPage.excellence.item3Title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.contactPage.excellence.item3Desc}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/25 px-5 py-5 text-center text-base font-semibold text-white sm:px-6 sm:text-lg md:text-xl">
            {t.contactPage.excellence.finalNote}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

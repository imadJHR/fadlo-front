"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useLanguage } from "../components/language-provider";
import { motion } from "framer-motion";

export default function ContactClientPage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  // ---------------- SEND MESSAGE TO BACKEND ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const res = await fetch("https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error("Contact error:", err);
    }

    setLoadingSubmit(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ------------------ HERO ------------------ */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent blur-3xl opacity-40" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          {t.contactPage.title}{" "}
          <span className="text-primary">{t.contactPage.titleSpan}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-gray-400 max-w-xl mx-auto text-lg"
        >
          {t.contactPage.description}
        </motion.p>
      </section>

      {/* ------------------ CONTACT CONTENT ------------------ */}
      <section className="container mx-auto px-4 pb-28 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT SIDE – INFO CARDS */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          {/* OFFICE */}
          <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/20 transition">
                <MapPin className="h-7 w-7 text-primary" />

              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Location</h3>
                <p className="text-gray-400">sidimaarouf Casablanca </p>
              </div>
            </CardContent>
          </Card>
          {/* PHONE */}
          <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/20 transition">
                <Phone className="h-7 w-7 text-primary" />

              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">phone</h3>
                <p className="text-white">+212661528619</p>
              </div>
            </CardContent>
          </Card>

          {/* EMAIL */}
          <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/20 transition">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Email</h3>
                <p className="text-gray-400">fadlocarmaroc@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ------------------ FORM ------------------ */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 border border-white/10 rounded-2xl p-10 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-3xl font-bold mb-6">{t.contactPage.formTitle}</h2>

          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-300 text-sm">{t.contactPage.name}</label>
                <Input
                  className="mt-2 bg-black/40 border-white/10 text-white"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">{t.contactPage.email}</label>
                <Input
                  className="mt-2 bg-black/40 border-white/10 text-white"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm">{t.contactPage.message}</label>
              <Textarea
                className="mt-2 bg-black/40 border-white/10 text-white min-h-[150px]"
                placeholder={t.contactPage.description}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              className="w-full h-12 text-lg bg-primary hover:bg-primary/80 transition-all flex items-center justify-center gap-3"
              type="submit"
              disabled={loadingSubmit}
            >
              <Send className="w-5 h-5" />
              {loadingSubmit ? t.contactPage.sending : t.contactPage.sendMessage}
            </Button>

            {success && (
              <p className="text-green-400 text-center text-lg mt-3">
                {t.contactPage.successMessage}
              </p>
            )}
          </form>
        </motion.div>
      </section>

      {/* ------------------ EXCELLENCE SECTION ------------------ */}
      <section className="container mx-auto px-4 py-28">
        <div className="bg-gradient-to-b from-black/60 to-black/30 border border-white/10 rounded-3xl p-14 shadow-2xl backdrop-blur-xl">

          <h2 className="text-4xl font-extrabold mb-8">
            {t.contactPage.excellence.title}
          </h2>

          <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-3xl">
            {t.contactPage.excellence.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{t.contactPage.excellence.item1Title}</h3>
              <p className="text-gray-400">{t.contactPage.excellence.item1Desc}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold">{t.contactPage.excellence.item2Title}</h3>
              <p className="text-gray-400">{t.contactPage.excellence.item2Desc}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold">{t.contactPage.excellence.item3Title}</h3>
              <p className="text-gray-400">{t.contactPage.excellence.item3Desc}</p>
            </div>
          </div>

          <div className="mt-14 p-6 bg-primary/10 border border-primary/30 rounded-2xl text-center text-white text-xl font-semibold shadow-xl">
            {t.contactPage.excellence.finalNote}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

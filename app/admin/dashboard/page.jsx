"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  FileText,
  Inbox,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";

const VEHICULES_URL =
  "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules";
const ORDERS_URL =
  "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/orders";
const MESSAGES_URL =
  "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/messages";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function DashboardPage() {
  const [totalVehicules, setTotalVehicules] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("--:--");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [vehiculesRes, ordersRes, messagesRes] = await Promise.all([
          axios.get(VEHICULES_URL),
          axios.get(ORDERS_URL),
          axios.get(MESSAGES_URL),
        ]);

        if (vehiculesRes.data.success) {
          setTotalVehicules(vehiculesRes.data.vehicules.length);
        }

        if (ordersRes.data.success) {
          setTotalOrders(ordersRes.data.orders.length);
        }

        if (messagesRes.data.success) {
          setTotalMessages(messagesRes.data.messages.length);
        }

        setLastUpdated(
          new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())
        );
      } catch (error) {
        console.error("Erreur dashboard admin :", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalOverview = totalVehicules + totalOrders + totalMessages;

  const overviewCards = useMemo(
    () => [
      {
        title: "Vehicules",
        value: totalVehicules,
        description: "Catalogue disponible dans l espace admin.",
        icon: CarFront,
        accent: "from-[#ff5a36]/22 via-[#ff2d2d]/10 to-transparent",
        iconClass: "bg-[#ff5a36]/12 text-[#ffb9a8]",
        valueClass: "text-[#ff8c73]",
      },
      {
        title: "Commandes",
        value: totalOrders,
        description: "Reservations et demandes a suivre.",
        icon: FileText,
        accent: "from-sky-500/22 via-sky-400/10 to-transparent",
        iconClass: "bg-sky-500/12 text-sky-200",
        valueClass: "text-sky-300",
      },
      {
        title: "Messages",
        value: totalMessages,
        description: "Conversations entrantes a traiter rapidement.",
        icon: MessageCircle,
        accent: "from-amber-500/22 via-amber-400/10 to-transparent",
        iconClass: "bg-amber-500/12 text-amber-200",
        valueClass: "text-amber-300",
      },
    ],
    [totalMessages, totalOrders, totalVehicules]
  );

  const quickActions = [
    {
      href: "/admin/vehicules",
      title: "Mettre a jour le parc",
      description: "Ajoute, edite ou archive rapidement tes vehicules.",
      icon: CarFront,
    },
    {
      href: "/admin/commandes",
      title: "Suivre les commandes",
      description: "Consulte les reservations en attente et les statuts en cours.",
      icon: FileText,
    },
    {
      href: "/admin/messages",
      title: "Repondre aux messages",
      description: "Garde une boite de reception claire et reactive.",
      icon: Inbox,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:gap-8"
    >
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,90,54,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_30%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-[#ff8c73]" />
                Dashboard admin
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Pilote ton activite avec un dashboard
                <span className="block bg-gradient-to-r from-white via-[#ffd0c5] to-[#ff8c73] bg-clip-text text-transparent">
                  moderne, clair et responsive
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Suis les vehicules, les commandes et les messages depuis une interface admin plus lisible, mieux hierarchisee et optimisee pour toutes les tailles d ecran.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Total suivi
                </p>
                <p className="mt-3 text-3xl font-black text-white">{totalOverview}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Derniere synchro
                </p>
                <p className="mt-3 text-3xl font-black text-[#ffb9a8]">{lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="relative overflow-hidden border-white/10 bg-white/[0.04] py-0 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
              <CardContent className="relative p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      {card.title}
                    </p>
                    <p className={`mt-4 text-4xl font-black ${card.valueClass}`}>
                      {loading ? "..." : card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/65">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </motion.section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <motion.section variants={itemVariants}>
          <Card className="overflow-hidden rounded-[28px] border-white/10 bg-white/[0.04] py-0 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                    Actions rapides
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                    Raccourcis de gestion
                  </h2>
                </div>
                <p className="text-sm text-white/55">
                  Acces direct aux sections les plus utilisees.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-[#ff5a36]/35 hover:bg-black/30"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-white/85 transition group-hover:bg-[#ff5a36]/12 group-hover:text-[#ffb9a8]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">
                        {action.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {action.description}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb9a8]">
                        Ouvrir
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card className="overflow-hidden rounded-[28px] border-white/10 bg-white/[0.04] py-0 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6 lg:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                Vue d ensemble
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Health check admin
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-emerald-100">Catalogue actifs</p>
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      Stable
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-emerald-100/75">
                    {totalVehicules} vehicules visibles dans le pilotage actuel.
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-400/15 bg-sky-500/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-sky-100">Reservations a traiter</p>
                    <span className="rounded-full bg-sky-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
                      En cours
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-sky-100/75">
                    {totalOrders} commandes recensees dans le back-office.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-amber-100">Boite de reception</p>
                    <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                      A suivre
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-amber-100/75">
                    {totalMessages} messages remontes depuis le backend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}

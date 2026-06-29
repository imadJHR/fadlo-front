"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Archive,
  ArrowRight,
  BadgeEuro,
  CalendarRange,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const ORDERS_URL =
  "https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws/api/orders";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getStatusMeta(status) {
  if (status === "confirmed") {
    return {
      label: "Confirmee",
      badge: "bg-emerald-500/12 text-emerald-200 ring-1 ring-emerald-400/25",
    };
  }

  if (status === "cancelled") {
    return {
      label: "Annulee",
      badge: "bg-red-500/12 text-red-200 ring-1 ring-red-400/25",
    };
  }

  return {
    label: "En attente",
    badge: "bg-amber-500/12 text-amber-200 ring-1 ring-amber-400/25",
  };
}

function ToastItem({ toast, onClose }) {
  const toneClass =
    toast.type === "success"
      ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-50"
      : toast.type === "error"
        ? "border-red-400/25 bg-red-500/12 text-red-50"
        : "border-sky-400/25 bg-sky-500/12 text-sky-50";

  const icon =
    toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i";

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-2xl border shadow-2xl backdrop-blur ${toneClass}`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-sm font-bold">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-xs leading-5 text-white/75">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function CommandesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("--:--");
  const [toasts, setToasts] = useState([]);
  const toastCounterRef = useRef(0);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });

  const showToast = (type, title, message = "") => {
    toastCounterRef.current += 1;
    const id = `toast-${toastCounterRef.current}`;

    setToasts((prev) => [...prev, { id, type, title, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(ORDERS_URL, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setLastUpdated(
          new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())
        );
      } else {
        console.error("API Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      showToast(
        "error",
        "Chargement impossible",
        "Les commandes n ont pas pu etre recuperees pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${ORDERS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === id ? { ...order, status } : order))
        );

        showToast(
          "success",
          "Statut mis a jour",
          status === "confirmed"
            ? "La commande a ete marquee comme confirmee."
            : "La commande a ete marquee comme annulee."
        );
      }
    } catch (err) {
      console.error("Update Status Error:", err);
      showToast(
        "error",
        "Mise a jour impossible",
        "Le statut de la commande n a pas pu etre modifie."
      );
    }
  };

  const openDeleteDialog = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`${ORDERS_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        showToast(
          "success",
          "Commande supprimee",
          "La commande a bien ete retiree de la liste admin."
        );
      }
    } catch (err) {
      console.error("Delete Error:", err);
      showToast(
        "error",
        "Suppression impossible",
        "La commande n a pas pu etre supprimee."
      );
    }
  };

  const confirmDeleteAction = async () => {
    const { id } = deleteDialog;
    closeDeleteDialog();
    await deleteOrder(id);
  };

  const stats = useMemo(
    () => ({
      total: orders.length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      confirmedRevenue: orders
        .filter((o) => o.status === "confirmed")
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    }),
    [orders]
  );

  const barData = [
    { name: "Confirmees", value: stats.confirmed, color: "#22c55e" },
    { name: "En attente", value: stats.pending, color: "#eab308" },
    { name: "Annulees", value: stats.cancelled, color: "#ef4444" },
  ];

  const summaryCards = [
    {
      title: "Total",
      value: stats.total,
      icon: FileText,
      accent: "from-white/10 to-transparent",
      iconClass: "bg-white/8 text-white/80",
      valueClass: "text-white",
    },
    {
      title: "Confirmees",
      value: stats.confirmed,
      icon: CheckCircle2,
      accent: "from-emerald-500/18 to-transparent",
      iconClass: "bg-emerald-500/12 text-emerald-200",
      valueClass: "text-emerald-300",
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Clock3,
      accent: "from-amber-500/18 to-transparent",
      iconClass: "bg-amber-500/12 text-amber-200",
      valueClass: "text-amber-300",
    },
    {
      title: "Annulees",
      value: stats.cancelled,
      icon: XCircle,
      accent: "from-red-500/18 to-transparent",
      iconClass: "bg-red-500/12 text-red-200",
      valueClass: "text-red-300",
    },
    {
      title: "Revenus confirmes",
      value: formatCurrency(stats.confirmedRevenue),
      icon: BadgeEuro,
      accent: "from-sky-500/18 to-transparent",
      iconClass: "bg-sky-500/12 text-sky-200",
      valueClass: "text-sky-300",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-2xl shadow-black/20 backdrop-blur-2xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            Commandes
          </p>
          <p className="mt-3 text-xl font-bold text-white">
            Chargement des commandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:gap-8"
    >
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-stretch gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,90,54,0.12),_transparent_30%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                Commandes admin
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Dashboard des commandes
                <span className="block bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                  moderne, lisible et full responsive
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Suis les reservations, mets a jour les statuts et garde une vision claire du revenu confirme depuis une interface admin plus propre.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Commandes suivies
                </p>
                <p className="mt-3 text-3xl font-black text-white">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Derniere synchro
                </p>
                <p className="mt-3 text-3xl font-black text-sky-300">{lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 xl:grid-cols-5"
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="relative overflow-hidden border-white/10 bg-white/[0.04] py-0 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      {card.title}
                    </p>
                    <p className={`mt-4 text-3xl font-black ${card.valueClass}`}>
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.18fr_0.92fr]">
        <motion.section variants={itemVariants}>
          <ChartCard title="Statistiques par statut" subtitle="Lecture rapide de la charge actuelle.">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#bfbfbf" tickLine={false} axisLine={false} />
                <YAxis stroke="#bfbfbf" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#111214",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={10}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.section>

        <motion.section variants={itemVariants}>
          <ChartCard title="Repartition des commandes" subtitle="Vue globale des statuts actifs.">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={barData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={94}
                  paddingAngle={4}
                >
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111214",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.section>
      </div>

      <motion.section variants={itemVariants}>
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Liste commandes
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Reservations detaillees
              </h2>
            </div>
            <p className="text-sm text-white/55">
              Actions rapides, lecture mobile et table complete sur grand ecran.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/70">
                <Archive className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">
                Aucune commande trouvee
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Les nouvelles reservations apparaitront ici des qu elles seront creees.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {orders.map((order) => {
                  const statusMeta = getStatusMeta(order.status);

                  return (
                    <div
                      key={order._id}
                      className="rounded-[24px] border border-white/10 bg-black/20 p-4 shadow-xl shadow-black/15"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-white">
                            {order.fullName}
                          </p>
                          <p className="truncate text-sm text-white/55">{order.email}</p>
                          <p className="text-sm text-white/55">{order.phone}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusMeta.badge}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-white/72 min-[420px]:grid-cols-2">
                        <InfoTile label="Voiture" value={order.car?.nom || "-"} />
                        <InfoTile
                          label="Prix total"
                          value={formatCurrency(order.totalPrice)}
                        />
                        <InfoTile
                          label="Dates"
                          value={`${formatDate(order.pickupDate)} -> ${formatDate(order.returnDate)}`}
                          wide
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                        {order.status !== "confirmed" && (
                          <Button
                            className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-semibold hover:bg-emerald-500"
                            onClick={() => updateStatus(order._id, "confirmed")}
                          >
                            Confirmer
                          </Button>
                        )}

                        {order.status !== "cancelled" && (
                          <Button
                            className="w-full rounded-full bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
                            onClick={() => updateStatus(order._id, "cancelled")}
                          >
                            Annuler
                          </Button>
                        )}

                        <Button
                          className="w-full rounded-full bg-red-600 py-2.5 text-sm font-semibold hover:bg-red-500 min-[420px]:col-span-2"
                          onClick={() => openDeleteDialog(order._id, order.fullName)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block">
                <Table className="min-w-[980px] text-left">
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="px-6 py-4 text-white/45">Client</TableHead>
                      <TableHead className="px-3 py-4 text-white/45">Voiture</TableHead>
                      <TableHead className="px-3 py-4 text-white/45">Dates</TableHead>
                      <TableHead className="px-3 py-4 text-white/45">Prix</TableHead>
                      <TableHead className="px-3 py-4 text-white/45">Statut</TableHead>
                      <TableHead className="px-6 py-4 text-center text-white/45">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => {
                      const statusMeta = getStatusMeta(order.status);

                      return (
                        <TableRow
                          key={order._id}
                          className="border-white/8 hover:bg-white/[0.03]"
                        >
                          <TableCell className="px-6 py-4 align-top whitespace-normal">
                            <p className="font-semibold text-white">{order.fullName}</p>
                            <p className="mt-1 text-sm text-white/55">{order.email}</p>
                            <p className="text-sm text-white/55">{order.phone}</p>
                          </TableCell>

                          <TableCell className="px-3 py-4 text-white/80">
                            {order.car?.nom || "-"}
                          </TableCell>

                          <TableCell className="px-3 py-4 text-white/70">
                            <div className="inline-flex items-center gap-2">
                              <CalendarRange className="h-4 w-4 text-white/35" />
                              <span>
                                {formatDate(order.pickupDate)}
                                <ArrowRight className="mx-2 inline h-3.5 w-3.5" />
                                {formatDate(order.returnDate)}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="px-3 py-4 font-bold text-sky-300">
                            {formatCurrency(order.totalPrice)}
                          </TableCell>

                          <TableCell className="px-3 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusMeta.badge}`}
                            >
                              {statusMeta.label}
                            </span>
                          </TableCell>

                          <TableCell className="px-6 py-4">
                            <div className="flex flex-wrap justify-center gap-2">
                              {order.status !== "confirmed" && (
                                <Button
                                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold hover:bg-emerald-500"
                                  onClick={() => updateStatus(order._id, "confirmed")}
                                >
                                  Confirmer
                                </Button>
                              )}

                              {order.status !== "cancelled" && (
                                <Button
                                  className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500"
                                  onClick={() => updateStatus(order._id, "cancelled")}
                                >
                                  Annuler
                                </Button>
                              )}

                              <Button
                                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500"
                                onClick={() => openDeleteDialog(order._id, order.fullName)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </motion.section>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] overflow-hidden rounded-[28px] border border-red-500/20 bg-[#101314] p-0 text-white shadow-2xl shadow-black/40 sm:max-w-lg">
          <div className="relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,90,54,0.18),_transparent_50%)]" />
            <div className="relative">
              <div className="inline-flex rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
                Action sensible
              </div>

              <DialogHeader className="mt-4 space-y-3 text-left">
                <DialogTitle className="text-2xl font-bold leading-tight text-white sm:text-[2rem]">
                  Supprimer cette commande ?
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm leading-6 text-white/75">
                  Tu es sur le point de supprimer
                  <span className="mx-1 font-semibold text-white">
                    {deleteDialog.name || "cette commande"}
                  </span>
                  . Cette action retirera definitivement la reservation du dashboard.
                </p>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 sm:w-auto"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAction}
                  className="w-full rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:brightness-110 sm:w-auto"
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-2xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm text-white/55">{subtitle}</p>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function InfoTile({ label, value, wide = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 ${
        wide ? "min-[420px]:col-span-2" : ""
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function CommandesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ORDERS ----------------
  const fetchOrders = async () => {
    try {
      const res = await fetch("https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/orders", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("❌ API Error:", data.message);
      }
    } catch (err) {
      console.error("❌ Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );
      }
    } catch (err) {
      console.error("❌ Update Status Error:", err);
    }
  };

  // ---------------- DELETE ORDER ----------------
  const deleteOrder = async (id) => {
    if (!confirm("Supprimer cette commande ?")) return;

    try {
      const res = await fetch(`https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  // ---------------- STATS ----------------
  const stats = {
    total: orders.length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,

    // ⭐ NEW : total revenue from confirmed orders
    confirmedRevenue: orders
      .filter((o) => o.status === "confirmed")
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0),
  };

  const barData = [
    { name: "Confirmées", value: stats.confirmed, color: "#22c55e" },
    { name: "En attente", value: stats.pending, color: "#eab308" },
    { name: "Annulées", value: stats.cancelled, color: "#ef4444" },
  ];

  const pieColors = ["#22c55e", "#eab308", "#ef4444"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Chargement des commandes…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0b0b0b] to-[#320000] text-white">

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center md:text-left">
          Dashboard des <span className="text-blue-400">Commandes</span>
        </h1>

        {/* ---------------------- STATS CARDS ---------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Confirmées" value={stats.confirmed} color="text-green-400" />
          <StatCard title="En attente" value={stats.pending} color="text-yellow-400" />
          <StatCard title="Annulées" value={stats.cancelled} color="text-red-400" />
          <StatCard
            title="Revenus Confirmés"
            value={`€${stats.confirmedRevenue}`}
            color="text-primary"
          />
        </div>

        {/* ---------------------- CHARTS ---------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* BAR CHART */}
          <ChartCard title="Statistiques par statut">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" radius={8}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* PIE CHART */}
          <ChartCard title="Répartition des commandes">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={barData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {barData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* ---------------------- TABLE ---------------------- */}
        <OrderTable
          orders={orders}
          updateStatus={updateStatus}
          deleteOrder={deleteOrder}
        />
      </div>
    </main>
  );
}

/* 🔹 STAT CARD COMPONENT */
function StatCard({ title, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10">
      <p className="text-gray-300 text-sm md:text-base">{title}</p>
      <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

/* 🔹 CHART WRAPPER CARD */
function ChartCard({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* 🔹 ORDERS TABLE COMPONENT */
function OrderTable({ orders, updateStatus, deleteOrder }) {
  if (orders.length === 0) {
    return (
      <div className="text-center bg-white/5 p-10 rounded-xl border border-white/10">
        <p className="text-gray-400 text-lg">Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 shadow-xl overflow-x-auto">
      <div className="min-w-[900px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-300 border-b border-white/10 text-sm md:text-base">
              <th className="p-3">Client</th>
              <th className="p-3">Voiture</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Prix Total</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-white/5 hover:bg-white/10 transition"
              >
                <td className="p-3">
                  <p className="font-semibold text-sm md:text-base">{order.fullName}</p>
                  <p className="text-gray-400 text-xs md:text-sm">{order.email}</p>
                  <p className="text-gray-400 text-xs md:text-sm">{order.phone}</p>
                </td>

                <td className="p-3 text-sm md:text-base">{order.car?.nom}</td>

                <td className="p-3 text-sm md:text-base">
                  {new Date(order.pickupDate).toLocaleDateString()} →{" "}
                  {new Date(order.returnDate).toLocaleDateString()}
                </td>

                <td className="p-3 text-primary font-bold text-sm md:text-base">
                  €{order.totalPrice}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs md:text-sm font-semibold
                      ${
                        order.status === "pending"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : order.status === "confirmed"
                          ? "bg-green-600/30 text-green-300"
                          : "bg-red-600/30 text-red-300"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-2">
                  {order.status !== "confirmed" && (
                    <Button
                      className="bg-green-700 hover:bg-green-600 px-3 md:px-4 py-2 text-xs md:text-sm"
                      onClick={() => updateStatus(order._id, "confirmed")}
                    >
                      Confirmer
                    </Button>
                  )}

                  {order.status !== "cancelled" && (
                    <Button
                      className="bg-yellow-700 hover:bg-yellow-600 px-3 md:px-4 py-2 text-xs md:text-sm"
                      onClick={() => updateStatus(order._id, "cancelled")}
                    >
                      Annuler
                    </Button>
                  )}

                  <Button
                    className="bg-red-700 hover:bg-red-600 px-3 md:px-4 py-2 text-xs md:text-sm"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";

export default function DashboardPage() {
  const VEHICULES_URL = "http://localhost:5000/api/vehicules";
  const ORDERS_URL = "http://localhost:5000/api/orders";
  const MESSAGES_URL = "http://localhost:5000/api/messages";

  const [totalVehicules, setTotalVehicules] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  // ⭐ Charger total véhicules
  const fetchVehiculeCount = async () => {
    try {
      const res = await axios.get(VEHICULES_URL);
      if (res.data.success) setTotalVehicules(res.data.vehicules.length);
    } catch (error) {
      console.error("❌ Erreur véhicules :", error);
    }
  };

  // ⭐ Charger total commandes
  const fetchOrdersCount = async () => {
    try {
      const res = await axios.get(ORDERS_URL);
      if (res.data.success) setTotalOrders(res.data.orders.length);
    } catch (error) {
      console.error("❌ Erreur commandes :", error);
    }
  };

  // ⭐ Charger total messages du backend
  const fetchMessagesCount = async () => {
    try {
      const res = await axios.get(MESSAGES_URL);

      if (res.data.success) {
        setTotalMessages(res.data.messages.length);
      } else {
        console.error("❌ Erreur API messages :", res.data.message);
      }
    } catch (error) {
      console.error("❌ Erreur messages :", error);
    }
  };

  useEffect(() => {
    fetchVehiculeCount();
    fetchOrdersCount();
    fetchMessagesCount();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8">
        Tableau de bord <span className="text-[#ff2d2d]">Admin</span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* 📦 Véhicules */}
        <Card className="bg-[#0f0f0f]/70 backdrop-blur-xl border border-[#1a1a1a] shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-200">Véhicules</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-[#ff2d2d]">
            {totalVehicules}
          </CardContent>
        </Card>

        {/* 🛒 Commandes */}
        <Card className="bg-[#0f0f0f]/70 backdrop-blur-xl border border-[#1a1a1a] shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-200">Commandes</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-blue-400">
            {totalOrders}
          </CardContent>
        </Card>

        {/* ✉️ Messages */}
        <Card className="bg-[#0f0f0f]/70 backdrop-blur-xl border border-[#1a1a1a] shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-200">Messages</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-yellow-400">
            {totalMessages}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

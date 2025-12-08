"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Si cookie existe → aller au dashboard
  useEffect(() => {
    const hasToken = document.cookie.includes("session_token=");
    if (hasToken) router.push("/admin/dashboard");
  }, [router]);

  const handleLogin = async () => {
    if (code.length !== 6) {
      alert("Code invalide");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    // ✅ Stocker dans un cookie lisible par middleware
    document.cookie = `session_token=${data.token}; path=/; max-age=86400`;

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-black via-[#0b0b0b] to-[#320000] p-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <Card className="bg-[#0f0f0f]/70 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold text-white">
              Code d’accès Admin
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 mt-2">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Entrez votre code sécurisé
              </label>

              <Input
                placeholder="••••••"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="text-center text-xl tracking-[0.4em]
                bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl"
              />
            </div>

            <Button
              disabled={loading}
              onClick={handleLogin}
              className="w-full bg-[#ff2d2d] hover:bg-[#e82626] 
              text-white rounded-full py-3 text-lg font-semibold shadow-lg"
            >
              {loading ? "Connexion..." : "Valider"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

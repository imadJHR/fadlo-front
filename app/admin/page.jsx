"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminHome() {
  const router = useRouter();

  // Si déjà connecté → aller au dashboard
  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-black via-[#0b0b0b] to-[#320000] px-6">
      
      {/* Conteneur principal */}
      <div className="max-w-4xl mx-auto">
        
        {/* Titre */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          Espace <span className="text-[#ff2d2d]">Administration</span>
        </h1>

        {/* Sous-texte */}
        <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-2xl">
          Accédez au panneau de gestion sécurisé pour administrer le site FADLO CAR,
          gérer la flotte de véhicules, les réservations et le contenu.
        </p>

        {/* Bouton */}
        <div className="mt-10 flex gap-4">
          <Button
            onClick={() => router.push("/admin/login")}
            className="bg-[#ff2d2d] hover:bg-[#e82626] text-white font-semibold rounded-full px-10 py-6 text-lg shadow-lg"
          >
            Accéder à l’espace Admin
          </Button>
        </div>

      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const logout = () => {
    document.cookie = "session_token=; max-age=0; path=/; SameSite=Lax";
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-[#0b0b0b] to-[#320000] text-white">

      {/* SIDEBAR visible seulement si pas sur login */}
      {!isLoginPage && (
        <aside className="w-64 bg-[#0f0f0f]/70 backdrop-blur-xl border-r border-[#1a1a1a] p-6 flex flex-col">
          <h2 className="text-3xl font-extrabold mb-10">
            FADLO <span className="text-[#ff2d2d]">CAR</span>
          </h2>

          <nav className="flex flex-col gap-4">
            <Link href="/admin/dashboard">📊 Dashboard</Link>
            <Link href="/admin/vehicules">🚗 Gérer véhicules</Link>
            <Link href="/admin/commandes">🧾 Commandes</Link>
            <Link href="/admin/messages">💬 Messages</Link>
          </nav>

          <button
            onClick={logout}
            className="mt-auto bg-[#ff2d2d] hover:bg-[#e82626] py-2 rounded-full font-semibold text-white"
          >
            Déconnexion
          </button>
        </aside>
      )}

      {/* CONTENU */}
      <main className={`flex-1 p-10 ${isLoginPage ? "w-full" : ""}`}>
        {children}
      </main>

    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/vehicules",
    label: "Gerer vehicules",
    icon: CarFront,
  },
  {
    href: "/admin/commandes",
    label: "Commandes",
    icon: FileText,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageCircle,
  },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              active
                ? "flex items-center gap-3 rounded-2xl border border-[#ff5a36]/30 bg-gradient-to-r from-[#ff5a36]/18 to-[#ff2d2d]/10 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/20"
                : "flex items-center gap-3 rounded-2xl border border-transparent bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/72 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
            }
          >
            <span
              className={
                active
                  ? "flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white"
                  : "flex h-10 w-10 items-center justify-center rounded-2xl bg-black/20 text-white/70"
              }
            >
              <Icon className="h-4 w-4" />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const logout = () => {
    document.cookie = "session_token=; max-age=0; path=/; SameSite=Lax";
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0b0b] to-[#320000] text-white">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,45,45,0.16),_transparent_30%),linear-gradient(135deg,_#030303_0%,_#0c0c0c_45%,_#220202_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-white/10 bg-black/30 px-6 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
              Admin panel
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              FADLO <span className="text-[#ff5a36]">CAR</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Tableau de pilotage moderne pour vehicules, commandes et messages.
            </p>
          </div>

          <div className="mt-6 flex-1 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/20">
            <NavLinks pathname={pathname} />
          </div>

          <button
            onClick={logout}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:brightness-110"
          >
            <LogOut className="h-4 w-4" />
            Deconnexion
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-2xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Admin panel
                </p>
                <p className="mt-1 text-lg font-black tracking-tight text-white">
                  FADLO <span className="text-[#ff5a36]">CAR</span>
                </p>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.08]">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="border-r border-white/10 bg-[#0b0b0b]/95 p-0 text-white backdrop-blur-2xl"
                >
                  <SheetHeader className="border-b border-white/10 p-5 text-left">
                    <SheetTitle className="text-2xl font-black tracking-tight text-white">
                      FADLO <span className="text-[#ff5a36]">CAR</span>
                    </SheetTitle>
                    <p className="text-sm leading-6 text-white/60">
                      Navigation admin rapide et responsive.
                    </p>
                  </SheetHeader>

                  <div className="flex h-full flex-col p-4">
                    <NavLinks pathname={pathname} />

                    <button
                      onClick={logout}
                      className="mt-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:brightness-110"
                    >
                      <LogOut className="h-4 w-4" />
                      Deconnexion
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

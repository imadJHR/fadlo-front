"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, Sparkles, Delete } from "lucide-react";

const API_BASE =
  "https://opu52ebcxzlawndvu4qdt3ooum0dbucj.lambda-url.eu-north-1.on.aws";

const keypadRows = [
  [
    { key: "1", letters: "" },
    { key: "2", letters: "ABC" },
    { key: "3", letters: "DEF" },
  ],
  [
    { key: "4", letters: "GHI" },
    { key: "5", letters: "JKL" },
    { key: "6", letters: "MNO" },
  ],
  [
    { key: "7", letters: "PQRS" },
    { key: "8", letters: "TUV" },
    { key: "9", letters: "WXYZ" },
  ],
];

const alphaRows = [
  ["A", "B", "C", "D", "E", "F"],
  ["G", "H", "I", "J", "K", "L"],
  ["M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X"],
  ["Y", "Z"],
];

function hasCookie(name) {
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .some((c) => c.startsWith(`${name}=`));
}

function ToastItem({ toast, onClose }) {
  const toneClass =
    toast.type === "success"
      ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-50"
      : "border-red-400/25 bg-red-500/12 text-red-50";

  const icon = toast.type === "success" ? "✓" : "!";

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

export default function LoginPage() {
  const router = useRouter();
  const inputRef = useRef(null);
  const toastCounterRef = useRef(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [keyboardMode, setKeyboardMode] = useState("numeric");

  useEffect(() => {
    if (hasCookie("session_token")) router.push("/admin/dashboard");
  }, [router]);

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

  const appendCharacter = (character) => {
    setCode((prev) => (prev.length < 6 ? `${prev}${character}` : prev));
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCode("");
    inputRef.current?.focus();
  };

  const handleLogin = async () => {
    if (code.length !== 6) {
      showToast(
        "error",
        "Code invalide",
        "Entre un code admin complet de 6 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `HTTP ${res.status} ${res.statusText} ${text}`.slice(0, 300)
        );
      }

      const data = await res.json();

      if (!data.success) {
        showToast(
          "error",
          "Code incorrect",
          data.message || "Le code saisi n est pas reconnu."
        );
        return;
      }

      if (!data.token) {
        showToast(
          "error",
          "Token manquant",
          "La reponse du serveur ne contient pas de session valide."
        );
        return;
      }

      const securePart =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? "; secure"
          : "";

      document.cookie = `session_token=${data.token}; path=/; max-age=86400; samesite=lax${securePart}`;

      showToast(
        "success",
        "Connexion reussie",
        "Redirection vers le dashboard admin..."
      );

      window.setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } catch (err) {
      console.error("Login failed:", err);
      showToast(
        "error",
        "Erreur reseau / CORS",
        "Verifie la config du backend et la route /api/login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,90,54,0.16),_transparent_30%),linear-gradient(135deg,_#030303_0%,_#0b0b0b_45%,_#2a0505_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-stretch gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_25%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid w-full overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,90,54,0.18),_transparent_35%)]" />

            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff8c73]" />
                  Espace admin securise
                </div>

                <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Acces admin
                  <span className="block bg-gradient-to-r from-white via-[#ffd0c5] to-[#ff8c73] bg-clip-text text-transparent">
                    design moderne + clavier web integre
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Saisis ton code d acces depuis le champ classique ou directement via un clavier web avec chiffres et lettres pour un acces plus robuste.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FeatureCard
                  icon={<LockKeyhole className="h-5 w-5" />}
                  title="Code securise"
                  description="Acces base sur un code admin court et rapide a saisir."
                />
                <FeatureCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Session protegee"
                  description="Creation de session via cookie compatible avec le middleware."
                />
                <FeatureCard
                  icon={<Sparkles className="h-5 w-5" />}
                  title="UX tactile"
                  description="Saisie confortable sur mobile, tablette, ecran tactile ou desktop."
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Connexion
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Entre ton code admin
              </h2>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-black/20 p-4 shadow-xl shadow-black/20 sm:p-5">
                <label className="text-sm font-medium text-white/80">
                  Code securise a 6 caracteres
                </label>

                <Input
                  ref={inputRef}
                  inputMode="text"
                  autoCapitalize="characters"
                  placeholder="AB12CD"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
                    )
                  }
                  className="mt-3 h-14 border-white/10 bg-[#151515] text-center text-xl tracking-[0.5em] text-white placeholder:text-white/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />

                <div className="mt-4 grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={
                        code[index]
                          ? "flex h-12 items-center justify-center rounded-2xl border border-[#ff5a36]/30 bg-[#ff5a36]/12 text-lg font-bold text-[#ffd0c5]"
                          : "flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-bold text-white/30"
                      }
                    >
                      {code[index] || "•"}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setKeyboardMode("numeric")}
                      className={
                        keyboardMode === "numeric"
                          ? "rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/25"
                          : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08]"
                      }
                    >
                      123
                    </button>
                    <button
                      type="button"
                      onClick={() => setKeyboardMode("letters")}
                      className={
                        keyboardMode === "letters"
                          ? "rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/25"
                          : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08]"
                      }
                    >
                      ABC
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {keyboardMode === "numeric"
                      ? keypadRows.map((row, rowIndex) => (
                          <div key={rowIndex} className="grid grid-cols-3 gap-3">
                            {row.map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => appendCharacter(item.key)}
                                className="group rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#ff5a36]/30 hover:bg-[#ff5a36]/8"
                              >
                                <div className="text-2xl font-black text-white">
                                  {item.key}
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35 group-hover:text-[#ffd0c5]">
                                  {item.letters || "Code"}
                                </div>
                              </button>
                            ))}
                          </div>
                        ))
                      : alphaRows.map((row, rowIndex) => (
                          <div
                            key={rowIndex}
                            className={`grid gap-3 ${
                              row.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-3 min-[520px]:grid-cols-6"
                            }`}
                          >
                            {row.map((letter) => (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => appendCharacter(letter)}
                                className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-lg font-bold text-white transition hover:-translate-y-0.5 hover:border-[#ff5a36]/30 hover:bg-[#ff5a36]/8"
                              >
                                {letter}
                              </button>
                            ))}
                          </div>
                        ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <div className="text-base font-bold text-white">Clear</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Reset
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => appendCharacter("0")}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#ff5a36]/30 hover:bg-[#ff5a36]/8"
                    >
                      <div className="text-2xl font-black text-white">0</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Space
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-2 text-base font-bold text-white">
                        <Delete className="h-4 w-4" />
                        Del
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Backspace
                      </div>
                    </button>
                  </div>
                </div>

                <Button
                  disabled={loading}
                  onClick={handleLogin}
                  className="mt-6 h-13 w-full rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff2d2d] text-base font-semibold text-white shadow-lg shadow-red-900/30 transition hover:brightness-110"
                >
                  {loading ? "Connexion..." : "Valider l acces"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-[#ffb9a8]">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}

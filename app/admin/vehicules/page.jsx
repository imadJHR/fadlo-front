"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";

function ToggleCard({
  checked,
  onCheckedChange,
  label,
  description,
  activeText,
  inactiveText,
  tone = "red",
}) {
  const accentClass =
    tone === "blue"
      ? "from-sky-500/20 via-sky-400/10 to-transparent"
      : "from-[#ff5a36]/20 via-[#ff2d2d]/10 to-transparent";

  const pillClass = checked
    ? tone === "blue"
      ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30"
      : "bg-[#ff5a36]/15 text-[#ffd2c7] ring-1 ring-[#ff5a36]/30"
    : "bg-white/8 text-white/65 ring-1 ring-white/10";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:col-span-2">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClass}`} />
      <div className="relative flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Label className="text-sm font-semibold text-white sm:text-base">
              {label}
            </Label>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${pillClass}`}
            >
              {checked ? activeText : inactiveText}
            </span>
          </div>
          <p className="max-w-xl text-xs leading-5 text-white/60 sm:text-sm">
            {description}
          </p>
        </div>

        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="h-7 w-12 border border-white/15 bg-white/10 data-[state=checked]:bg-[#ff5a36]"
        />
      </div>
    </div>
  );
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

// ================================================
//  PAGE GESTION DES VÉHICULES & MARQUES
// ================================================
export default function VehiculesPage() {
  const API_URL =
    "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/vehicules";
  const BRAND_API_URL =
    "https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/api/brands";

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;

  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [currentCar, setCurrentCar] = useState(null);

  // Dialogs Marques
  const [openAddBrand, setOpenAddBrand] = useState(false);
  const [openEditBrand, setOpenEditBrand] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastCounterRef = useRef(0);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null,
    id: null,
    name: "",
  });

  // --------------------------------------------------
  // Helper pour avoir un URL image propre
  // --------------------------------------------------
  const getImageUrl = (img) => {
    if (!img) return "";

    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    let clean = img.replace(/^\/+/, "").replace(/\\/g, "/");

    if (!clean.startsWith("uploads/")) {
      clean = `uploads/${clean}`;
    }

    return `https://5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws/${clean}`;
  };

  // --------------------------------------------------
  // Fetch VEHICULES
  // --------------------------------------------------
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setVehicles(res.data.vehicules);
    } catch (err) {
      console.error("Erreur fetch véhicules :", err);
    }
  };

  // --------------------------------------------------
  // Fetch BRANDS
  // --------------------------------------------------
  const fetchBrands = async () => {
    try {
      const res = await axios.get(BRAND_API_URL);
      if (res.data.success) setBrands(res.data.brands);
    } catch (err) {
      console.error("Erreur fetch marques :", err);
    }
  };

  // --------------------------------------------------
  // Fetch all on mount
  // --------------------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchVehicles(), fetchBrands()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // --------------------------------------------------
  // Form states (Vehicles)
  // --------------------------------------------------
  const emptyAddForm = {
    nom: "",
    marque: "",
    type: "",
    prixParJour: "",
    description: "",
    vedette: false,
    disponible: true,
    seats: "",
    fuel: "",
    transmission: "",
    images: [],
  };

  const [formAdd, setFormAdd] = useState(emptyAddForm);
  const [formEdit, setFormEdit] = useState({});

  // --------------------------------------------------
  // Form states (Brands)
  // --------------------------------------------------
  const [formAddBrand, setFormAddBrand] = useState({
    title: "",
    image: null,
  });

  const [formEditBrand, setFormEditBrand] = useState({
    title: "",
    image: "",
    newImage: null,
  });

  const inputClassName =
    "border border-white/10 bg-[#161616] text-white placeholder:text-white/35 focus-visible:border-[#ff5a36] focus-visible:ring-[#ff5a36]/25";

  const selectClassName =
    "min-h-11 rounded-xl border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none transition focus:border-[#ff5a36] focus:ring-2 focus:ring-[#ff5a36]/20";

  const fileInputClassName =
    "w-full rounded-xl border border-dashed border-white/15 bg-[#161616] p-2.5 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15";

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

  const openDeleteDialog = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, type: null, id: null, name: "" });
  };

  // --------------------------------------------------
  // IMAGES DYNAMIQUES (ADD)
  // --------------------------------------------------
  const addImageInputAdd = () => {
    setFormAdd((prev) => ({ ...prev, images: [...prev.images, null] }));
  };

  const updateAddImage = (index, file) => {
    const arr = [...formAdd.images];
    arr[index] = file;
    setFormAdd({ ...formAdd, images: arr });
  };

  const removeAddImage = (index) => {
    const arr = [...formAdd.images];
    arr.splice(index, 1);
    setFormAdd({ ...formAdd, images: arr });
  };

  // --------------------------------------------------
  // IMAGES DYNAMIQUES (EDIT)
  // --------------------------------------------------
  const addImageInputEdit = () => {
    setFormEdit((prev) => ({
      ...prev,
      newImages: [...(prev.newImages || []), null],
    }));
  };

  const updateEditImage = (index, file) => {
    const arr = [...(formEdit.newImages || [])];
    arr[index] = file;
    setFormEdit({ ...formEdit, newImages: arr });
  };

  const removeEditImage = (index) => {
    const arr = [...(formEdit.newImages || [])];
    arr.splice(index, 1);
    setFormEdit({ ...formEdit, newImages: arr });
  };

  // --------------------------------------------------
  // ADD VEHICULE
  // --------------------------------------------------
  const handleAdd = async () => {
    try {
      const fd = new FormData();

      Object.entries(formAdd).forEach(([key, val]) => {
        if (key !== "images") fd.append(key, val);
      });

      fd.append("specifications[seats]", formAdd.seats);
      fd.append("specifications[fuel]", formAdd.fuel);
      fd.append("specifications[transmission]", formAdd.transmission);

      formAdd.images.forEach((file) => file && fd.append("images", file));

      const res = await axios.post(API_URL, fd, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setOpenAdd(false);
        setFormAdd(emptyAddForm);
        fetchVehicles();
        showToast(
          "success",
          "Vehicule ajoute",
          "Le nouveau vehicule est maintenant disponible dans le dashboard."
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Ajout impossible",
        "Le vehicule na pas pu etre ajoute. Verifie les champs et reessaie."
      );
    }
  };

  // --------------------------------------------------
  // EDIT VEHICULE
  // --------------------------------------------------
  const handleEdit = async () => {
    try {
      const fd = new FormData();

      Object.entries(formEdit).forEach(([key, val]) => {
        if (!["images", "newImages"].includes(key)) {
          fd.append(key, val);
        }
      });

      fd.append("specifications[seats]", formEdit.seats);
      fd.append("specifications[fuel]", formEdit.fuel);
      fd.append("specifications[transmission]", formEdit.transmission);

      const safeExisting = (formEdit.images || []).filter(
        (img) => img && typeof img === "string" && img.trim() !== ""
      );
      fd.append("imagesExistantes", JSON.stringify(safeExisting));

      (formEdit.newImages || []).forEach((file) => {
        if (file) fd.append("images", file);
      });

      const res = await axios.put(`${API_URL}/${currentCar._id}`, fd, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setOpenEdit(false);
        fetchVehicles();
        showToast(
          "success",
          "Vehicule mis a jour",
          "Les modifications du vehicule ont bien ete enregistrees."
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Modification impossible",
        "Le vehicule na pas pu etre modifie. Reessaie dans quelques instants."
      );
    }
  };

  // --------------------------------------------------
  // DELETE VEHICULE
  // --------------------------------------------------
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      fetchVehicles();
      showToast(
        "success",
        "Vehicule supprime",
        "Le vehicule a ete retire de la liste admin."
      );
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Suppression impossible",
        "Le vehicule na pas pu etre supprime."
      );
    }
  };

  // --------------------------------------------------
  // ADD BRAND
  // --------------------------------------------------
  const handleAddBrand = async () => {
    try {
      const fd = new FormData();
      fd.append("title", formAddBrand.title);
      if (formAddBrand.image) fd.append("image", formAddBrand.image);

      const res = await axios.post(BRAND_API_URL, fd, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setOpenAddBrand(false);
        setFormAddBrand({ title: "", image: null });
        fetchBrands();
        showToast(
          "success",
          "Marque ajoutee",
          "La nouvelle marque est disponible dans les filtres et les formulaires."
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Ajout de marque impossible",
        "La marque na pas pu etre ajoutee."
      );
    }
  };

  // --------------------------------------------------
  // EDIT BRAND
  // --------------------------------------------------
  const handleEditBrand = async () => {
    try {
      const fd = new FormData();
      fd.append("title", formEditBrand.title);

      if (formEditBrand.newImage) fd.append("image", formEditBrand.newImage);
      else if (formEditBrand.image) fd.append("image", formEditBrand.image);

      const res = await axios.put(`${BRAND_API_URL}/${currentBrand._id}`, fd, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setOpenEditBrand(false);
        fetchBrands();
        showToast(
          "success",
          "Marque mise a jour",
          "Les informations de la marque ont bien ete sauvegardees."
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Modification de marque impossible",
        "La mise a jour de la marque a echoue."
      );
    }
  };

  // --------------------------------------------------
  // DELETE BRAND
  // --------------------------------------------------
  const deleteBrand = async (id) => {
    try {
      await axios.delete(`${BRAND_API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      fetchBrands();
      showToast(
        "success",
        "Marque supprimee",
        "La marque a bien ete retiree du catalogue admin."
      );
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "Suppression de marque impossible",
        "La marque na pas pu etre supprimee."
      );
    }
  };

  const confirmDeleteAction = async () => {
    const { type, id } = deleteDialog;

    closeDeleteDialog();

    if (type === "vehicle") {
      await deleteVehicle(id);
      return;
    }

    if (type === "brand") {
      await deleteBrand(id);
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#300] p-4 text-white sm:p-6 lg:p-8">
        <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-2xl backdrop-blur">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-[#111] to-[#300] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-stretch gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 lg:gap-12">
        {/* HEADER VEHICULES */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
              Dashboard
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Gestion des{" "}
              <span className="text-[#ff2d2d]">Véhicules</span>
            </h1>
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="w-full rounded-full bg-[#ff2d2d] px-5 py-3 text-sm font-semibold shadow-lg shadow-red-900/30 transition hover:bg-red-500 sm:w-auto sm:px-6"
          >
            ➕ Ajouter un véhicule
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">Vehicules</p>
            <p className="mt-3 text-3xl font-bold text-white">{vehicles.length}</p>
            <p className="mt-1 text-sm text-white/60">Modeles geres dans le dashboard.</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.06] p-4 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">Disponibles</p>
            <p className="mt-3 text-3xl font-bold text-emerald-100">
              {vehicles.filter((car) => car.disponible).length}
            </p>
            <p className="mt-1 text-sm text-emerald-100/65">Vehicules reservables actuellement.</p>
          </div>
          <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.06] p-4 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Vedettes</p>
            <p className="mt-3 text-3xl font-bold text-amber-100">
              {vehicles.filter((car) => car.vedette).length}
            </p>
            <p className="mt-1 text-sm text-amber-100/65">Modeles mis en avant sur le site.</p>
          </div>
          <div className="rounded-2xl border border-sky-400/15 bg-sky-500/[0.06] p-4 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/70">Marques</p>
            <p className="mt-3 text-3xl font-bold text-sky-100">{brands.length}</p>
            <p className="mt-1 text-sm text-sky-100/65">Marques visibles dans les filtres.</p>
          </div>
        </div>

        {/* LISTE DES VEHICULES */}
        <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {vehicles.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center shadow-xl backdrop-blur">
              <p className="text-lg font-semibold text-white">Aucun vehicule pour le moment</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Ajoute un premier vehicule pour remplir le catalogue admin et commencer a gerer les disponibilites.
              </p>
            </div>
          )}
          {vehicles.map((car) => (
            <div
              key={car._id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f]/75 shadow-2xl shadow-black/30 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={getImageUrl(car.images?.[0])}
                  alt={car.nom || "Véhicule"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {car.vedette && (
                  <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black shadow-lg">
                    ⭐ Vedette
                  </span>
                )}
              </div>

              <div className="flex h-full flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold sm:text-xl">
                    {car.nom}
                  </h2>
                  <p className="truncate text-sm text-gray-400">
                    {car.marque}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      car.disponible
                        ? "rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400"
                        : "rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400"
                    }
                  >
                    {car.disponible ? "Disponible" : "Non disponible"}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {car.prixParJour}€/jour
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/70">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Places</p>
                    <p className="mt-1 text-sm font-semibold text-white">{car.specifications?.seats || "-"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Fuel</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">{car.specifications?.fuel || "-"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Boite</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">{car.specifications?.transmission || "-"}</p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                  <button
                    onClick={() => {
                      setCurrentCar(car);
                      setFormEdit({
                        ...car,
                        images: (car.images || []).filter(
                          (img) =>
                            img && typeof img === "string" && img.trim() !== ""
                        ),
                        seats: car.specifications?.seats || "",
                        fuel: car.specifications?.fuel || "",
                        transmission: car.specifications?.transmission || "",
                        newImages: [],
                      });
                      setOpenEdit(true);
                    }}
                    className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    ✏️ Modifier
                  </button>

                  <button
                    onClick={() => openDeleteDialog("vehicle", car._id, car.nom)}
                    className="w-full rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500"
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================
            SECTION MARQUES
        ========================================================= */}
        <div className="border-t border-white/10 pt-8 lg:pt-10">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                Marques
              </p>
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                Gestion des{" "}
                <span className="text-[#ff2d2d]">Marques</span>
              </h2>
            </div>

            <button
              onClick={() => setOpenAddBrand(true)}
              className="w-full rounded-full bg-[#ff2d2d] px-5 py-3 text-sm font-semibold shadow-lg shadow-red-900/30 transition hover:bg-red-500 sm:w-auto sm:px-6"
            >
              ➕ Ajouter une marque
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {brands.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center shadow-xl backdrop-blur">
                <p className="text-lg font-semibold text-white">Aucune marque disponible</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Ajoute au moins une marque pour remplir les filtres et les formulaires de vehicules.
                </p>
              </div>
            )}
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="flex min-h-[220px] flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f0f]/75 p-4 text-center shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-red-500/40"
              >
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black sm:h-24 sm:w-24">
                  {brand.image ? (
                    <img
                      src={getImageUrl(brand.image)}
                      alt={brand.title || "Marque"}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </div>

                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold sm:text-base">
                  {brand.title}
                </p>

                <div className="mt-auto grid w-full grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setCurrentBrand(brand);
                      setFormEditBrand({
                        title: brand.title,
                        image: brand.image || "",
                        newImage: null,
                      });
                      setOpenEditBrand(true);
                    }}
                    className="rounded-full bg-blue-600 py-2 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      openDeleteDialog("brand", brand._id, brand.title)
                    }
                    className="rounded-full bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-500"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            POPUP AJOUT VEHICULE
        ========================================================= */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-2xl">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-[#ff2d2d] sm:text-3xl">
                  ➕ Ajouter un véhicule
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-2xl border border-[#ff5a36]/20 bg-gradient-to-r from-[#ff5a36]/10 via-[#ff2d2d]/5 to-transparent p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb8a8]">
                  Nouveau vehicule
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Renseigne les infos principales, puis active les options de visibilite et de disponibilite via les toggles ci-dessous.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NOM */}
                <Input
                  placeholder="Nom"
                  className={inputClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, nom: e.target.value })
                  }
                />

                {/* MARQUE */}
                <select
                  className={selectClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, marque: e.target.value })
                  }
                >
                  <option value="">Sélectionner une marque</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b.title}>
                      {b.title}
                    </option>
                  ))}
                </select>

                {/* TYPE / CATÉGORIE */}
                <select
                  className={selectClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, type: e.target.value })
                  }
                >
                  <option value="">Catégorie</option>
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline</option>
                  <option value="Sport">Sport</option>
                  <option value="Citadine">Citadine</option>
                  <option value="Utilitaire">Utilitaire</option>
                </select>

                {/* PRIX */}
                <Input
                  type="number"
                  placeholder="Prix par jour"
                  className={inputClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, prixParJour: e.target.value })
                  }
                />

                {/* DESCRIPTION */}
                <Input
                  className={`${inputClassName} sm:col-span-2`}
                  placeholder="Description"
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, description: e.target.value })
                  }
                />

                {/* VEDETTE */}
                <ToggleCard
                  checked={formAdd.vedette}
                  onCheckedChange={(v) => setFormAdd({ ...formAdd, vedette: v })}
                  label="Vehicule vedette"
                  description="Mets ce modele en avant sur les zones premium et les selections prioritaires du site."
                  activeText="Actif"
                  inactiveText="Standard"
                />

                {/* DISPONIBLE */}
                <ToggleCard
                  checked={formAdd.disponible}
                  onCheckedChange={(v) =>
                    setFormAdd({ ...formAdd, disponible: v })
                  }
                  label="Disponibilite immediate"
                  description="Controle si le vehicule apparait comme reservable immediatement dans le catalogue client."
                  activeText="En ligne"
                  inactiveText="Pause"
                />

                {/* SIÈGES */}
                <select
                  className={selectClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, seats: e.target.value })
                  }
                >
                  <option value="">Sièges</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="7">7</option>
                </select>

                {/* CARBURANT */}
                <select
                  className={selectClassName}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, fuel: e.target.value })
                  }
                >
                  <option value="">Carburant</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>

                {/* TRANSMISSION */}
                <select
                  className={`${selectClassName} sm:col-span-2`}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, transmission: e.target.value })
                  }
                >
                  <option value="">Transmission</option>
                  <option value="Automatique">Automatique</option>
                  <option value="Manuelle">Manuelle</option>
                </select>

                {/* IMAGES (ADD) */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2 sm:p-4">
                  <h3 className="text-sm font-semibold text-white/90">
                    Images :
                  </h3>

                  {formAdd.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                      <input
                        type="file"
                        className={fileInputClassName}
                        onChange={(e) => updateAddImage(idx, e.target.files[0])}
                      />
                      <button
                        onClick={() => removeAddImage(idx)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500 sm:w-auto"
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addImageInputAdd}
                    className="w-full rounded-xl bg-gray-700 py-2.5 text-sm font-semibold transition hover:bg-gray-600"
                  >
                    ➕ Ajouter une image
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAdd}
                className="mt-6 w-full rounded-full bg-[#ff2d2d] py-3 font-semibold hover:bg-red-500"
              >
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================
            POPUP EDIT VEHICULE
        ========================================================= */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-3xl">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="break-words text-2xl font-bold text-blue-400 sm:text-3xl">
                  ✏ Modifier — {formEdit.nom}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-500/10 via-sky-400/5 to-transparent p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/90">
                  Edition vehicule
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Ajuste la fiche du modele, mets a jour ses medias et pilote ses statuts sans quitter la vue admin.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NOM */}
                <Input
                  value={formEdit.nom || ""}
                  className={inputClassName}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, nom: e.target.value })
                  }
                />

                {/* MARQUE */}
                <select
                  className={selectClassName}
                  value={formEdit.marque || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, marque: e.target.value })
                  }
                >
                  <option value="">Sélectionner une marque</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b.title}>
                      {b.title}
                    </option>
                  ))}
                </select>

                {/* TYPE / CATÉGORIE */}
                <select
                  className={selectClassName}
                  value={formEdit.type || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, type: e.target.value })
                  }
                >
                  <option value="">Catégorie</option>
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline</option>
                  <option value="Sport">Sport</option>
                  <option value="Citadine">Citadine</option>
                  <option value="Utilitaire">Utilitaire</option>
                </select>

                {/* PRIX */}
                <Input
                  type="number"
                  value={formEdit.prixParJour || ""}
                  className={inputClassName}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      prixParJour: e.target.value,
                    })
                  }
                />

                {/* DESCRIPTION */}
                <Input
                  className={`${inputClassName} sm:col-span-2`}
                  value={formEdit.description || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      description: e.target.value,
                    })
                  }
                />

                {/* VEDETTE */}
                <ToggleCard
                  checked={Boolean(formEdit.vedette)}
                  onCheckedChange={(v) =>
                    setFormEdit({ ...formEdit, vedette: v })
                  }
                  label="Vehicule vedette"
                  description="Conserve ce modele parmi les propositions mises en avant dans l'experience publique."
                  activeText="Actif"
                  inactiveText="Standard"
                  tone="blue"
                />

                {/* DISPONIBLE */}
                <ToggleCard
                  checked={Boolean(formEdit.disponible)}
                  onCheckedChange={(v) =>
                    setFormEdit({ ...formEdit, disponible: v })
                  }
                  label="Disponibilite immediate"
                  description="Active ou suspend la reservation de ce vehicule sans modifier le reste de sa fiche."
                  activeText="En ligne"
                  inactiveText="Pause"
                  tone="blue"
                />

                {/* SIÈGES */}
                <select
                  className={selectClassName}
                  value={formEdit.seats || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, seats: e.target.value })
                  }
                >
                  <option value="">Sièges</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="7">7</option>
                </select>

                {/* CARBURANT */}
                <select
                  className={selectClassName}
                  value={formEdit.fuel || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, fuel: e.target.value })
                  }
                >
                  <option value="">Carburant</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>

                {/* TRANSMISSION */}
                <select
                  className={`${selectClassName} sm:col-span-2`}
                  value={formEdit.transmission || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      transmission: e.target.value,
                    })
                  }
                >
                  <option value="">Transmission</option>
                  <option value="Automatique">Automatique</option>
                  <option value="Manuelle">Manuelle</option>
                </select>

                {/* IMAGES ACTUELLES */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2 sm:p-4">
                  <h3 className="text-base font-semibold sm:text-lg">
                    Images actuelles :
                  </h3>

                   <div className="mt-3 grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 lg:grid-cols-4">
                    {(formEdit.images || []).map((img, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-xl border border-[#333] bg-black"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Image véhicule ${i + 1}`}
                          className="h-24 w-full object-cover sm:h-28"
                        />

                        <button
                          onClick={() =>
                            setFormEdit({
                              ...formEdit,
                              images: formEdit.images.filter((a) => a !== img),
                            })
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold opacity-100 transition hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AJOUT DE NOUVELLES IMAGES */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2 sm:p-4">
                  <h3 className="text-sm font-semibold text-white/90">
                    Ajouter des images :
                  </h3>

                  {(formEdit.newImages || []).map((img, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                      <input
                        type="file"
                        className={fileInputClassName}
                        onChange={(e) =>
                          updateEditImage(i, e.target.files[0])
                        }
                      />
                      <button
                        onClick={() => removeEditImage(i)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500"
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addImageInputEdit}
                    className="w-full rounded-xl bg-gray-700 py-2.5 text-sm font-semibold transition hover:bg-gray-600"
                  >
                    ➕ Ajouter une image
                  </button>
                </div>
              </div>

              <Button
                onClick={handleEdit}
                className="mt-6 w-full rounded-full bg-blue-600 py-3 font-semibold hover:bg-blue-500"
              >
                Sauvegarder les modifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================
            POPUP AJOUT MARQUE
        ========================================================= */}
        <Dialog open={openAddBrand} onOpenChange={setOpenAddBrand}>
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-md">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-[#ff2d2d]">
                  ➕ Ajouter une marque
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-2xl border border-[#ff5a36]/20 bg-gradient-to-r from-[#ff5a36]/10 via-[#ff2d2d]/5 to-transparent p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb8a8]">
                  Nouvelle marque
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Ajoute un nom et un logo pour enrichir les filtres et le rendu du catalogue.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <Label>Nom de la marque</Label>
                  <Input
                    className={`mt-2 ${inputClassName}`}
                    placeholder="Ex: Mercedes"
                    value={formAddBrand.title}
                    onChange={(e) =>
                      setFormAddBrand({
                        ...formAddBrand,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Logo / Image</Label>
                  <input
                    type="file"
                    className={`mt-2 ${fileInputClassName}`}
                    onChange={(e) =>
                      setFormAddBrand({
                        ...formAddBrand,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleAddBrand}
                className="mt-6 w-full rounded-full bg-[#ff2d2d] py-3 font-semibold hover:bg-red-500"
              >
                Ajouter la marque
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================
            POPUP EDIT MARQUE
        ========================================================= */}
        <Dialog open={openEditBrand} onOpenChange={setOpenEditBrand}>
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-md">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-blue-400">
                  ✏ Modifier la marque
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-500/10 via-sky-400/5 to-transparent p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/90">
                  Edition marque
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Mets a jour l identite visuelle de la marque sans casser l experience actuelle du dashboard.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <Label>Nom de la marque</Label>
                  <Input
                    className={`mt-2 ${inputClassName}`}
                    value={formEditBrand.title}
                    onChange={(e) =>
                      setFormEditBrand({
                        ...formEditBrand,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Logo actuel</Label>
                  <div className="mt-3 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    {formEditBrand.image ? (
                      <img
                        src={getImageUrl(formEditBrand.image)}
                        alt="Logo actuel"
                        className="h-16 w-16 rounded-lg border border-[#333] bg-black object-contain p-2"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">
                        Aucune image
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Changer le logo</Label>
                  <input
                    type="file"
                    className={`mt-2 ${fileInputClassName}`}
                    onChange={(e) =>
                      setFormEditBrand({
                        ...formEditBrand,
                        newImage: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleEditBrand}
                className="mt-6 w-full rounded-full bg-blue-600 py-3 font-semibold hover:bg-blue-500"
              >
                Sauvegarder la marque
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                    Supprimer cet element ?
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm leading-6 text-white/75">
                    Tu es sur le point de supprimer
                    <span className="mx-1 font-semibold text-white">
                      {deleteDialog.name || "cet element"}
                    </span>
                    . Cette action retirera definitivement la fiche du dashboard.
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
      </div>
    </div>
  );
}

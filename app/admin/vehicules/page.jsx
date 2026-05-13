"use client";

import { useEffect, useState } from "react";
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
        alert("🚗 Véhicule ajouté !");
        setOpenAdd(false);
        setFormAdd(emptyAddForm);
        fetchVehicles();
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout !");
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
        alert("✏️ Véhicule modifié !");
        setOpenEdit(false);
        fetchVehicles();
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification !");
    }
  };

  // --------------------------------------------------
  // DELETE VEHICULE
  // --------------------------------------------------
  const deleteVehicle = async (id) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: token },
    });
    fetchVehicles();
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
        alert("🏁 Marque ajoutée !");
        setOpenAddBrand(false);
        setFormAddBrand({ title: "", image: null });
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de la marque !");
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
        alert("✏️ Marque modifiée !");
        setOpenEditBrand(false);
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification de la marque !");
    }
  };

  // --------------------------------------------------
  // DELETE BRAND
  // --------------------------------------------------
  const deleteBrand = async (id) => {
    if (!confirm("Supprimer cette marque ?")) return;
    await axios.delete(`${BRAND_API_URL}/${id}`, {
      headers: { Authorization: token },
    });
    fetchBrands();
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

        {/* LISTE DES VEHICULES */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {vehicles.map((car) => (
            <div
              key={car._id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f]/75 shadow-2xl shadow-black/30 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
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

              <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
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

                <div className="mt-2 grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-2">
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
                    className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    ✏️ Modifier
                  </button>

                  <button
                    onClick={() => deleteVehicle(car._id)}
                    className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500"
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f0f]/75 p-4 text-center shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-red-500/40"
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

                <div className="grid w-full grid-cols-2 gap-2">
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
                    onClick={() => deleteBrand(brand._id)}
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
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-xl lg:max-w-2xl">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-[#ff2d2d] sm:text-3xl">
                  ➕ Ajouter un véhicule
                </DialogTitle>
              </DialogHeader>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NOM */}
                <Input
                  placeholder="Nom"
                  className="bg-[#1a1a1a]"
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, nom: e.target.value })
                  }
                />

                {/* MARQUE */}
                <select
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="bg-[#1a1a1a]"
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, prixParJour: e.target.value })
                  }
                />

                {/* DESCRIPTION */}
                <Input
                  className="bg-[#1a1a1a] sm:col-span-2"
                  placeholder="Description"
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, description: e.target.value })
                  }
                />

                {/* VEDETTE */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                  <Switch
                    checked={formAdd.vedette}
                    onCheckedChange={(v) =>
                      setFormAdd({ ...formAdd, vedette: v })
                    }
                  />
                  <Label>Véhicule Vedette</Label>
                </div>

                {/* DISPONIBLE */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                  <Switch
                    checked={formAdd.disponible}
                    onCheckedChange={(v) =>
                      setFormAdd({ ...formAdd, disponible: v })
                    }
                  />
                  <Label>Disponible</Label>
                </div>

                {/* SIÈGES */}
                <select
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring sm:col-span-2"
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
                        className="w-full rounded-md bg-[#1a1a1a] p-2 text-sm"
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
                    className="w-full rounded-md bg-gray-700 py-2.5 text-sm font-semibold transition hover:bg-gray-600"
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
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-2xl lg:max-w-3xl">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="break-words text-2xl font-bold text-blue-400 sm:text-3xl">
                  ✏ Modifier — {formEdit.nom}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NOM */}
                <Input
                  value={formEdit.nom || ""}
                  className="bg-[#1a1a1a]"
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, nom: e.target.value })
                  }
                />

                {/* MARQUE */}
                <select
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="bg-[#1a1a1a]"
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      prixParJour: e.target.value,
                    })
                  }
                />

                {/* DESCRIPTION */}
                <Input
                  className="bg-[#1a1a1a] sm:col-span-2"
                  value={formEdit.description || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      description: e.target.value,
                    })
                  }
                />

                {/* VEDETTE */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                  <Switch
                    checked={Boolean(formEdit.vedette)}
                    onCheckedChange={(v) =>
                      setFormEdit({ ...formEdit, vedette: v })
                    }
                  />
                  <Label>Véhicule Vedette</Label>
                </div>

                {/* DISPONIBLE */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                  <Switch
                    checked={Boolean(formEdit.disponible)}
                    onCheckedChange={(v) =>
                      setFormEdit({ ...formEdit, disponible: v })
                    }
                  />
                  <Label>Disponible</Label>
                </div>

                {/* SIÈGES */}
                <select
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="min-h-10 rounded-md bg-[#1a1a1a] p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring sm:col-span-2"
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

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                        className="w-full rounded-md bg-[#1a1a1a] p-2 text-sm"
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
                    className="w-full rounded-md bg-gray-700 py-2.5 text-sm font-semibold transition hover:bg-gray-600"
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
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-md">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-[#ff2d2d]">
                  ➕ Ajouter une marque
                </DialogTitle>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div>
                  <Label>Nom de la marque</Label>
                  <Input
                    className="mt-2 bg-[#1a1a1a]"
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
                    className="mt-2 w-full rounded-md bg-[#1a1a1a] p-2 text-sm"
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
          <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#333] bg-[#111] p-0 text-white sm:w-full sm:max-w-md">
            <div className="max-h-[92dvh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-2xl font-bold text-blue-400">
                  ✏ Modifier la marque
                </DialogTitle>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div>
                  <Label>Nom de la marque</Label>
                  <Input
                    className="mt-2 bg-[#1a1a1a]"
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
                    className="mt-2 w-full rounded-md bg-[#1a1a1a] p-2 text-sm"
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
      </div>
    </div>
  );
}
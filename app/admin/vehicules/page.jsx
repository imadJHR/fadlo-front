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
  const API_URL = "http://localhost:5000/api/vehicules";
  const BRAND_API_URL = "http://localhost:5000/api/brands";

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

    return `http://localhost:5000/${clean}`;
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
  if (loading) return <p className="text-white p-8">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#300] text-white p-8 space-y-12">

      {/* HEADER VEHICULES */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">
          Gestion des <span className="text-[#ff2d2d]">Véhicules</span>
        </h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#ff2d2d] px-6 py-3 rounded-full"
        >
          ➕ Ajouter un véhicule
        </button>
      </div>

      {/* LISTE DES VEHICULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {vehicles.map((car) => (
          <div
            key={car._id}
            className="bg-[#0f0f0f]/70 border border-[#222] rounded-xl overflow-hidden"
          >
            <img
              src={getImageUrl(car.images?.[0])}
              className="h-40 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {car.nom}
                {car.vedette && <span className="text-yellow-400">⭐</span>}
              </h2>

              <p className="text-gray-400">{car.marque}</p>

              <p className={car.disponible ? "text-green-400" : "text-red-500"}>
                {car.disponible ? "Disponible" : "Non disponible"}
              </p>

              <p>{car.prixParJour}€/jour</p>

              <div className="flex gap-3 mt-4">
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
                  className="flex-1 bg-blue-600 py-2 rounded-full"
                >
                  ✏️ Modifier
                </button>

                <button
                  onClick={() => deleteVehicle(car._id)}
                  className="flex-1 bg-red-600 py-2 rounded-full"
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
      <div className="border-t border-[#333] pt-10 mt-4">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold">
            Gestion des <span className="text-[#ff2d2d]">Marques</span>
          </h2>
          <button
            onClick={() => setOpenAddBrand(true)}
            className="bg-[#ff2d2d] px-6 py-3 rounded-full"
          >
            ➕ Ajouter une marque
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-[#0f0f0f]/70 border border-[#222] rounded-xl p-4 flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-[#333] bg-black flex items-center justify-center">
                {brand.image ? (
                  <img
                    src={getImageUrl(brand.image)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <p className="font-semibold text-center">{brand.title}</p>

              <div className="flex gap-2 w-full mt-2">
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
                  className="flex-1 bg-blue-600 py-1 rounded-full text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteBrand(brand._id)}
                  className="flex-1 bg-red-600 py-1 rounded-full text-sm"
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
        <DialogContent className="bg-[#111] border border-[#333] text-white max-w-xl p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#ff2d2d] font-bold">
              ➕ Ajouter un véhicule
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">

            {/* NOM */}
            <Input
              placeholder="Nom"
              onChange={(e) =>
                setFormAdd({ ...formAdd, nom: e.target.value })
              }
            />

            {/* MARQUE */}
            <select
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              onChange={(e) =>
                setFormAdd({ ...formAdd, prixParJour: e.target.value })
              }
            />

            {/* DESCRIPTION */}
            <Input
              className="col-span-2"
              placeholder="Description"
              onChange={(e) =>
                setFormAdd({ ...formAdd, description: e.target.value })
              }
            />

            {/* VEDETTE */}
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={formAdd.vedette}
                onCheckedChange={(v) =>
                  setFormAdd({ ...formAdd, vedette: v })
                }
              />
              <Label>Véhicule Vedette</Label>
            </div>

            {/* DISPONIBLE */}
            <div className="col-span-2 flex items-center gap-2">
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded col-span-2"
              onChange={(e) =>
                setFormAdd({ ...formAdd, transmission: e.target.value })
              }
            >
              <option value="">Transmission</option>
              <option value="Automatique">Automatique</option>
              <option value="Manuelle">Manuelle</option>
            </select>

            {/* IMAGES (ADD) */}
            <div className="col-span-2 space-y-2">
              <h3>Images :</h3>
              {formAdd.images.map((img, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="file"
                    className="bg-[#1a1a1a] p-2 rounded w-full"
                    onChange={(e) =>
                      updateAddImage(idx, e.target.files[0])
                    }
                  />
                  <button
                    onClick={() => removeAddImage(idx)}
                    className="bg-red-600 px-3 py-2 rounded"
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button
                onClick={addImageInputAdd}
                className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
              >
                ➕ Ajouter une image
              </button>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            className="w-full bg-[#ff2d2d] mt-6 py-3 rounded-full"
          >
            Ajouter
          </Button>
        </DialogContent>
      </Dialog>

      {/* =========================================================
          POPUP EDIT VEHICULE
      ========================================================= */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-[#111] border border-[#333] max-w-2xl rounded-xl text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl text-blue-400 font-bold">
              ✏ Modifier — {formEdit.nom}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">

            {/* NOM */}
            <Input
              value={formEdit.nom || ""}
              onChange={(e) =>
                setFormEdit({ ...formEdit, nom: e.target.value })
              }
            />

            {/* MARQUE */}
            <select
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              onChange={(e) =>
                setFormEdit({
                  ...formEdit,
                  prixParJour: e.target.value,
                })
              }
            />

            {/* DESCRIPTION */}
            <Input
              className="col-span-2"
              value={formEdit.description || ""}
              onChange={(e) =>
                setFormEdit({
                  ...formEdit,
                  description: e.target.value,
                })
              }
            />

            {/* VEDETTE */}
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={Boolean(formEdit.vedette)}
                onCheckedChange={(v) =>
                  setFormEdit({ ...formEdit, vedette: v })
                }
              />
              <Label>Véhicule Vedette</Label>
            </div>

            {/* DISPONIBLE */}
            <div className="col-span-2 flex items-center gap-2">
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded"
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
              className="bg-[#1a1a1a] p-2 rounded col-span-2"
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
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold">Images actuelles :</h3>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {(formEdit.images || []).map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      className="h-24 w-full object-cover rounded border border-[#333]"
                    />
                    <button
                      onClick={() =>
                        setFormEdit({
                          ...formEdit,
                          images: formEdit.images.filter((a) => a !== img),
                        })
                      }
                      className="absolute top-1 right-1 bg-red-600 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AJOUT DE NOUVELLES IMAGES */}
            <div className="col-span-2 mt-4 space-y-2">
              <h3 className="font-semibold">Ajouter des images :</h3>

              {(formEdit.newImages || []).map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="file"
                    className="bg-[#1a1a1a] p-2 rounded w-full"
                    onChange={(e) =>
                      updateEditImage(i, e.target.files[0])
                    }
                  />
                  <button
                    onClick={() => removeEditImage(i)}
                    className="bg-red-600 px-3 py-2 rounded"
                  >
                    ✖
                  </button>
                </div>
              ))}

              <button
                onClick={addImageInputEdit}
                className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
              >
                ➕ Ajouter une image
              </button>
            </div>
          </div>

          <Button
            onClick={handleEdit}
            className="w-full bg-blue-600 mt-6 py-3 rounded-full"
          >
            Sauvegarder les modifications
          </Button>
        </DialogContent>
      </Dialog>

      {/* =========================================================
          POPUP AJOUT MARQUE
      ========================================================= */}
      <Dialog open={openAddBrand} onOpenChange={setOpenAddBrand}>
        <DialogContent className="bg-[#111] border border-[#333] text-white max-w-md p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#ff2d2d] font-bold">
              ➕ Ajouter une marque
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Nom de la marque</Label>
              <Input
                className="mt-1"
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
                className="mt-2 w-full bg-[#1a1a1a] p-2 rounded"
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
            className="w-full bg-[#ff2d2d] mt-6 py-3 rounded-full"
          >
            Ajouter la marque
          </Button>
        </DialogContent>
      </Dialog>

      {/* =========================================================
          POPUP EDIT MARQUE
      ========================================================= */}
      <Dialog open={openEditBrand} onOpenChange={setOpenEditBrand}>
        <DialogContent className="bg-[#111] border border-[#333] text-white max-w-md p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-400 font-bold">
              ✏ Modifier la marque
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Nom de la marque</Label>
              <Input
                className="mt-1"
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
              <div className="mt-2 flex items-center gap-4">
                {formEditBrand.image ? (
                  <img
                    src={getImageUrl(formEditBrand.image)}
                    className="w-16 h-16 object-contain rounded border border-[#333] bg-black"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Aucune image</span>
                )}
              </div>
            </div>

            <div>
              <Label>Changer le logo</Label>
              <input
                type="file"
                className="mt-2 w-full bg-[#1a1a1a] p-2 rounded"
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
            className="w-full bg-blue-600 mt-6 py-3 rounded-full"
          >
            Sauvegarder la marque
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

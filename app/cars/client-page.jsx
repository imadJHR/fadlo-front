"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CarCard from "../components/car-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "../components/language-provider";
import { useSearchParams } from "next/navigation";

export default function CarsClientPage() {
  const API_URL = "http://localhost:5000/api/vehicules";
  const BRAND_API_URL = "http://localhost:5000/api/brands";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [brands, setBrands] = useState([]);
  const [brandFilter, setBrandFilter] = useState("All");

  // NEW STATE → AVAILABLE: All / Available / Unavailable
  const [availability, setAvailability] = useState("Available");

  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const brandFromURL = searchParams.get("brand") || "";
  const searchFromURL = searchParams.get("search") || "";

  const normalize = (str) => str?.trim().toLowerCase() || "";

  /* --------------------------------------------------
     FETCH BRANDS
  -------------------------------------------------- */
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch(BRAND_API_URL);
        const data = await res.json();
        if (data.success) setBrands(data.brands);
      } catch (err) {
        console.error("Erreur fetch marques:", err);
      }
    };

    loadBrands();
  }, []);

  /* --------------------------------------------------
     FETCH + FILTER CARS
  -------------------------------------------------- */
  const fetchCars = useCallback(
    async (searchTerm, cat, brand, availabilityValue) => {
      setLoading(true);

      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!data.success) return;

        let list = data.vehicules;

        // 🔥 Availability filter
        if (availabilityValue === "Available") {
          list = list.filter((car) => car.disponible === true);
        } else if (availabilityValue === "Unavailable") {
          list = list.filter((car) => car.disponible === false);
        }

        // SEARCH FILTER
        if (searchTerm) {
          const q = normalize(searchTerm);
          list = list.filter(
            (car) =>
              normalize(car.nom).includes(q) ||
              normalize(car.marque).includes(q)
          );
        }

        // BRAND FILTER
        if (brand && brand !== "All") {
          list = list.filter(
            (car) => normalize(car.marque) === normalize(brand)
          );
        }

        // CATEGORY FILTER
        if (cat && cat !== "All") {
          list = list.filter(
            (car) => normalize(car.type) === normalize(cat)
          );
        }

        setCars(list);
      } catch (error) {
        console.error("Erreur chargement véhicules:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* --------------------------------------------------
     APPLY URL SEARCH PARAM
  -------------------------------------------------- */
  useEffect(() => {
    if (searchFromURL) setSearch(searchFromURL);

    fetchCars(searchFromURL, category, brandFilter, availability);
  }, [searchFromURL, fetchCars]);

  /* --------------------------------------------------
     APPLY URL BRAND PARAM
  -------------------------------------------------- */
  useEffect(() => {
    if (brandFromURL) setBrandFilter(brandFromURL);

    fetchCars(searchFromURL || search, category, brandFromURL || brandFilter, availability);
  }, [brandFromURL, fetchCars]);

  /* --------------------------------------------------
     APPLY WHEN ANY FILTER CHANGES
  -------------------------------------------------- */
  useEffect(() => {
    fetchCars(searchFromURL || search, category, brandFilter, availability);
  }, [brandFilter, category, availability, fetchCars]);

  /* --------------------------------------------------
     SEARCH SUBMIT
  -------------------------------------------------- */
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars(search, category, brandFilter, availability);
  };

  /* --------------------------------------------------
     IMAGE URL FIX
  -------------------------------------------------- */
  const getImageUrl = (img) =>
    img ? `http://localhost:5000/${img.replace(/^\/+/, "")}` : "";

  const categories = ["All", "SUV", "Berline", "Sport", "Citadine", "Utilitaire"];

  const availabilityOptions = [
    { value: "All", label: "Tous" },
    { value: "Available", label: "Disponible" },
    { value: "Unavailable", label: "Indisponible" }
  ];

  return (
    <main className="min-h-screen pt-24 bg-black">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10">
          {t.carsPage.title}{" "}
          <span className="text-primary">{t.carsPage.titleSpan}</span>
        </h1>

        {/* BRAND FILTER */}
        <div className="mb-12">
          <h3 className="text-lg text-gray-300 mb-4">Filtrer par marque :</h3>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setBrandFilter("All")}
              variant={brandFilter === "All" ? "default" : "outline"}
              className={brandFilter === "All" ? "bg-primary text-white" : "text-white border-white/20"}
            >
              Toutes
            </Button>

            {brands.map((b) => (
              <button
                key={b._id}
                onClick={() => setBrandFilter(b.title)}
                className={`w-16 h-16 rounded-xl flex items-center justify-center border ${
                  normalize(brandFilter) === normalize(b.title)
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white"
                }`}
              >
                <img src={getImageUrl(b.image)} className="w-10 h-10 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              variant={category === cat ? "default" : "outline"}
              className={category === cat ? "bg-primary text-white" : "text-white border-white/20"}
            >
              {cat === "All" ? t.carsPage.filterAll : cat}
            </Button>
          ))}
        </div>

        {/* AVAILABILITY FILTER (NEW) */}
        <div className="flex flex-wrap gap-2 mb-12">
          {availabilityOptions.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => setAvailability(opt.value)}
              variant={availability === opt.value ? "default" : "outline"}
              className={availability === opt.value ? "bg-primary text-white" : "text-white border-white/20"}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-12">
          <Input
            placeholder="Rechercher un véhicule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 text-white border-white/20"
          />

          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* VEHICLES GRID */}
        {loading ? (
          <p className="text-white">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <CarCard key={car._id} car={car} index={index} />
            ))}
          </div>
        )}

        {!loading && cars.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            Aucun véhicule trouvé.
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}

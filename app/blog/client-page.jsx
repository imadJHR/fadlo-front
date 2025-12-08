"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import BlogCard from "@/app/components/blog-card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { blogPosts } from "@/lib/blog";
import { useLanguage } from "@/app/components/language-provider";

export default function BlogClientPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");

  // Categories list
  const categories = useMemo(() => {
    const list = [...new Set(blogPosts.map((p) => p.category_fr))];
    return ["Tous", ...list];
  }, []);

  // Filter logic
  const filteredPosts = useMemo(() => {
    const normalize = (s) => s?.toLowerCase().trim() || "";

    return blogPosts.filter((post) => {
      const categoryMatch =
        category === "Tous" ||
        normalize(post.category_fr) === normalize(category);

      const title =
        language === "fr"
          ? post.title_fr
          : post.title_en || post.title;

      const excerpt =
        language === "fr"
          ? post.excerpt_fr
          : post.excerpt_en || post.excerpt;

      const searchMatch =
        !search ||
        normalize(title).includes(normalize(search)) ||
        normalize(excerpt).includes(normalize(search));

      return categoryMatch && searchMatch;
    });
  }, [category, search, language]);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-4xl md:text-6xl font-bold"
          >
            {t.blogPage.title}{" "}
            <span className="text-primary">{t.blogPage.titleSpan}</span>
          </motion.h1>
          <p className="text-gray-400 text-xl mt-4">
            {t.blogPage.description}
          </p>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/10 blur-[150px] -z-10" />
      </section>

      {/* SEARCH / FILTER */}
      <section className="container mx-auto px-4 mb-16">

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Input
            placeholder={t.blogPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 text-white border-white/20"
          />

          {search.length > 0 && (
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
              onClick={() => setSearch("")}
            >
              {t.blogPage.reset}
            </Button>
          )}
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)}
              className={
                category === cat
                  ? "bg-primary text-white"
                  : "text-white border-white/20 hover:bg-white/10"
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="container mx-auto px-4 pb-20">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400 text-xl py-20">
            {t.blogPage.noResults}
          </p>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 },
                }}
              >
                <BlogCard post={post} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}

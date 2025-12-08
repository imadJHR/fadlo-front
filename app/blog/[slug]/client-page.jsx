"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { useLanguage } from "@/app/components/language-provider";
import Image from "next/image";

export default function BlogClient({ post }) {
  const { language } = useLanguage();
  const contentRef = useRef(null);

  const title = language === "fr" ? post.title_fr : post.title_en || post.title;
  const excerpt = language === "fr" ? post.excerpt_fr : post.excerpt_en || post.excerpt;
  const category = language === "fr" ? post.category_fr : post.category_en || post.category;
  
  // Only use French content since English content isn't provided in your data
  const content = post.content;

  // Add interactivity to content elements
  useEffect(() => {
    if (contentRef.current) {
      // Add styling to tables
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach(table => {
        table.classList.add('w-full', 'border-collapse', 'my-6');
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
          if (index === 0) {
            row.classList.add('bg-primary/20');
          } else if (index % 2 === 0) {
            row.classList.add('bg-gray-900/30');
          }
        });
        const cells = table.querySelectorAll('th, td');
        cells.forEach(cell => {
          cell.classList.add('border', 'border-gray-700', 'px-4', 'py-3');
          if (cell.tagName === 'TH') {
            cell.classList.add('text-left', 'font-semibold');
          }
        });
      });

      // Add styling to lists
      const lists = contentRef.current.querySelectorAll('ul, ol');
      lists.forEach(list => {
        list.classList.add('space-y-2', 'my-4');
      });

      // Add hover effects to headings
      const headings = contentRef.current.querySelectorAll('h2, h3');
      headings.forEach(heading => {
        heading.classList.add('group', 'relative');
      });
    }
  }, [content]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* HERO SECTION WITH BACKGROUND GRADIENT */}
      <section className="relative w-full h-[60vh] flex items-center justify-center mb-16">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-black/80 to-black" />
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168,85,247,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(59,130,246,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />

        {/* Hero Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={post.image}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Content Container */}
        <div className="relative z-10 text-center max-w-5xl px-6">
          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-primary text-sm font-medium">
              {category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary">
              {title}
            </span>
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            {excerpt}
          </motion.p>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary">F</span>
              </div>
              <span>{post.author}</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(post.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-primary rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* CONTENT SECTION */}
      <section className="container mx-auto px-4 max-w-4xl pb-28">
        {/* FEATURE IMAGE */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-[500px] md:h-[600px]">
              <Image
                src={post.image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Image Caption */}
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-sm text-gray-300 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
                {title} - {post.author}
              </p>
            </div>
          </motion.div>
        )}

        {/* ARTICLE CONTENT */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Content Container */}
          <div className="relative z-10">
            {/* Floating Table of Contents for long articles */}
            {content.includes('<h2>') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden lg:block absolute -left-64 top-0 w-56"
              >
                <div className="sticky top-28 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Sommaire</h3>
                  <ul className="space-y-3">
                    {Array.from(content.matchAll(/<h2>(.*?)<\/h2>/g)).map((match, index) => (
                      <li key={index}>
                        <a 
                          href={`#section-${index}`}
                          className="text-gray-400 hover:text-primary text-sm transition-colors duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(`section-${index}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          {index + 1}. {match[1].replace(/<[^>]*>/g, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Main Content */}
            <div
              ref={contentRef}
              className="prose prose-invert prose-lg max-w-none leading-relaxed tracking-wide"
              style={{
                '--tw-prose-body': '#d1d5db',
                '--tw-prose-headings': '#ffffff',
                '--tw-prose-lead': '#9ca3af',
                '--tw-prose-links': '#3b82f6',
                '--tw-prose-bold': '#ffffff',
                '--tw-prose-counters': '#6b7280',
                '--tw-prose-bullets': '#4b5563',
                '--tw-prose-hr': '#374151',
                '--tw-prose-quotes': '#9ca3af',
                '--tw-prose-quote-borders': '#3b82f6',
                '--tw-prose-captions': '#9ca3af',
                '--tw-prose-code': '#ffffff',
                '--tw-prose-pre-code': '#d1d5db',
                '--tw-prose-pre-bg': '#1f2937',
                '--tw-prose-th-borders': '#4b5563',
                '--tw-prose-td-borders': '#374151',
              }}
            >
              {/* Add IDs to h2 elements for TOC navigation */}
              <div dangerouslySetInnerHTML={{
                __html: content.replace(
                  /<h2>(.*?)<\/h2>/g,
                  (match, content, index) => 
                    `<h2 id="section-${index}" class="text-3xl font-bold mt-12 mb-6 pb-4 border-b border-gray-800 group">${content}</h2>`
                ).replace(
                  /<h3>(.*?)<\/h3>/g,
                  (match, content) => 
                    `<h3 class="text-2xl font-semibold mt-10 mb-4 text-primary">${content}</h3>`
                ).replace(
                  /<p>/g,
                  '<p class="mb-6 text-gray-300">'
                ).replace(
                  /<ul>/g,
                  '<ul class="list-disc pl-6 mb-6">'
                ).replace(
                  /<ol>/g,
                  '<ol class="list-decimal pl-6 mb-6">'
                ).replace(
                  /<li>/g,
                  '<li class="mb-2 text-gray-300">'
                ).replace(
                  /<strong>/g,
                  '<strong class="text-white font-semibold">'
                )
              }} />
            </div>
          </div>

          {/* Floating Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-full hover:bg-primary/20 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button
              onClick={() => {
                const selection = window.getSelection();
                if (selection.toString().length > 0) {
                  navigator.clipboard.writeText(selection.toString());
                }
              }}
              className="p-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-full hover:bg-primary/20 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </motion.div>
        </motion.article>

        {/* SHARE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Partager cet article</h3>
              <p className="text-gray-400">Si vous avez trouvé cet article utile</p>
            </div>
            <div className="flex gap-3">
              {['Twitter', 'Facebook', 'LinkedIn', 'WhatsApp'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(title);
                    let shareUrl = '';
                    
                    switch(platform) {
                      case 'Twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                        break;
                      case 'Facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                      case 'LinkedIn':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                      case 'WhatsApp':
                        shareUrl = `https://wa.me/?text=${text}%20${url}`;
                        break;
                    }
                    
                    window.open(shareUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-sm">{platform}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM GRADIENT GLOW */}
        <div className="mt-20 w-full h-64 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-[120px] rounded-full mx-auto" />
      </section>

      <Footer />
    </main>
  );
}
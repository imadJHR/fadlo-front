"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../components/language-provider"

export default function BlogCard({ post, index }) {
  const { t, language } = useLanguage()

  const title = language === "fr" ? post.title_fr || post.title : post.title
  const excerpt = language === "fr" ? post.excerpt_fr || post.excerpt : post.excerpt
  const category = language === "fr" ? post.category_fr || post.category : post.category

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* 🔥 NOW USING post.slug INSTEAD OF post.id */}
      <Link href={`/blog/${post.slug}`}>
        <Card className="bg-white/5 border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
          
          {/* IMAGE */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {category}
            </div>
          </div>

          {/* HEADER */}
          <CardHeader className="p-6">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-primary" />
                {post.author}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </CardHeader>

          {/* EXCERPT */}
          <CardContent className="p-6 pt-0 flex-grow">
            <p className="text-gray-400 text-sm line-clamp-3">{excerpt}</p>
          </CardContent>

          {/* READ MORE */}
          <CardFooter className="p-6 pt-0 mt-auto">
            <Button variant="link" className="text-primary p-0 h-auto hover:text-white group/btn">
              {t.blogPage.readMore}
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </CardFooter>
          
        </Card>
      </Link>
    </motion.div>
  )
}

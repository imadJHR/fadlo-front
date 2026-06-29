import { notFound } from "next/navigation";
import BlogClient from "./client-page";
import { blogPosts } from "@/lib/blog";

const baseUrl = "https://fadllocar.ma";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Article introuvable | Fadlo Car",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = post.title_fr || post.title;
  const description = post.excerpt_fr || post.excerpt;
  const canonical = `${baseUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: [
      title.toLowerCase(),
      post.category_fr || post.category,
      "location voiture casablanca",
      "location voiture maroc",
      "Fadlo Car blog",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | Fadlo Car`,
      description,
      url: canonical,
      siteName: "Fadlo Car",
      type: "article",
      locale: "fr_MA",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image || "/hero.png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Fadlo Car`,
      description,
      images: [post.image || "/hero.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params; // Fixes "params is a Promise"

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return <BlogClient post={post} />;
}

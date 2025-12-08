import { notFound } from "next/navigation";
import BlogClient from "./client-page";
import { blogPosts } from "@/lib/blog";

export default async function BlogPage({ params }) {
  const { slug } = await params; // Fixes "params is a Promise"

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return <BlogClient post={post} />;
}

'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";

const posts = [
  {
    title: "How to choose the right fertilizer for your crop",
    category: "Crop Nutrition",
    summary: "A quick guide to selecting fertilizers based on soil condition and crop stage.",
    image: assets.k14
  },
  {
    title: "5 common weed control mistakes and how to avoid them",
    category: "Farm Practices",
    summary: "Avoid these mistakes to improve weed control and protect your crop yield.",
    image: assets.kk4
  },
  {
    title: "Pre-season checklist for better harvest outcomes",
    category: "Planning",
    summary: "Use this practical checklist to prepare your farm before the growing season starts.",
    image: assets.k35
  }
];

const Blog = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12 min-h-[70vh]">
        <section className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">Blog</p>
          <h1 className="text-3xl md:text-5xl font-medium text-gray-900">Insights for smarter farming</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Explore practical guides, product tips, and field-ready advice from our team.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-10">
          {posts.map((post) => (
            <article key={post.title} className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
              <Image
                src={post.image}
                alt={post.category}
                className="w-full h-44 object-cover rounded-lg"
                width={600}
                height={300}
              />
              <span className="text-xs uppercase tracking-[0.15em] text-green-700">{post.category}</span>
              <h2 className="text-xl font-medium text-gray-900">{post.title}</h2>
              <p className="text-gray-600">{post.summary}</p>
              <button type="button" className="text-green-700 hover:text-green-800 text-sm font-medium">
                Read more
              </button>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;

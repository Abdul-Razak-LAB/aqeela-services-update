import React from "react";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router, searchQuery } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category).filter(Boolean))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      (product.category || "").toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center pt-14 max-sm:pt-10">
      <p className="text-sm max-sm:text-[11px] tracking-[0.2em] font-semibold text-amber-700 uppercase text-left w-full">Most requested picks</p>
      <p className="text-[42px] leading-tight max-sm:text-[34px] font-semibold text-slate-700 text-left w-full mt-2">Popular products</p>
      <p className="text-lg leading-7 max-sm:text-xs max-sm:leading-5 text-slate-600 text-left w-full mt-1">Explore trusted agrochemical solutions from Aqeela Services, designed to protect crops and improve farm productivity.</p>
      <div className="mt-5 mb-1 flex flex-wrap items-center gap-2 w-full">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                isActive
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      {normalizedQuery && (
        <p className="text-sm text-gray-500 text-left w-full mt-2">Search results for "{searchQuery}"</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-7 mt-7 md:mt-8 pb-14 w-full">
        {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
      {filteredProducts.length === 0 && (
        <p className="text-sm text-gray-500 pb-8">No products found. Try a different keyword.</p>
      )}
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;

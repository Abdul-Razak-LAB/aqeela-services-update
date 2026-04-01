import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router, searchQuery } = useAppContext()

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    )
    : products;

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      {normalizedQuery && (
        <p className="text-sm text-gray-500 text-left w-full mt-2">Search results for "{searchQuery}"</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
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

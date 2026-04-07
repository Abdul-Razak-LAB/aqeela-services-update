'use client'
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {

    const { products, searchQuery } = useAppContext();
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
        <>
            <Navbar />
            <div className="site-container max-w-[1220px] flex flex-col items-start pt-11 max-sm:pt-7 pb-14">
                <div className="flex flex-col items-start gap-2">
                    <p className="text-sm max-sm:text-[11px] tracking-[0.2em] font-semibold text-amber-700 uppercase">Most requested picks</p>
                    <p className="text-[42px] leading-tight max-sm:text-[34px] font-semibold text-slate-700">Popular products</p>
                    <p className="text-lg leading-7 max-sm:text-xs max-sm:leading-5 text-slate-600">Explore trusted agrochemical solutions from Aqeela Services, designed to protect crops and improve farm productivity.</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
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
                    <p className="text-sm text-gray-500 mt-4">Search results for "{searchQuery}"</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-5 gap-y-5 md:gap-y-7 mt-7 md:mt-8 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                {filteredProducts.length === 0 && (
                    <p className="text-sm text-gray-500 pt-10">No products found. Try a different keyword.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;

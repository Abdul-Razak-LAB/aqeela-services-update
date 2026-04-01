'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {

    const { products, searchQuery } = useAppContext();

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredProducts = normalizedQuery
        ? products.filter((product) =>
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery)
        )
        : products;

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                {normalizedQuery && (
                    <p className="text-sm text-gray-500 mt-4">Search results for "{searchQuery}"</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                {filteredProducts.length === 0 && (
                    <p className="text-sm text-gray-500 pb-14">No products found. Try a different keyword.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;

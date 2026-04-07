import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {

    const { currency, router, addToCart } = useAppContext()

    const handleBuyNow = async (e) => {
        e.stopPropagation()
        await addToCart(product._id)
        router.push('/cart')
        scrollTo(0, 0)
    }

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex h-full flex-col items-start w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative w-full rounded-2xl overflow-hidden bg-[#f4f4f4] border border-gray-200">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-[1.02] transition duration-300 object-contain p-2 w-full aspect-[4/5]"
                    width={800}
                    height={800}
                />
                <button className="absolute top-2 right-2 bg-white/95 p-1.5 rounded-full shadow-sm border border-gray-200">
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <div className="w-full pt-2.5">
            <p className="text-lg max-sm:text-base font-medium text-slate-800 truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/90 truncate mt-0.5 max-sm:hidden">{product.description}</p>
            <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-slate-600">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1.5">
                <p className="text-3xl font-semibold text-slate-900 tracking-tight">{currency}{product.offerPrice}</p>
                <button onClick={handleBuyNow} className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-orange-600 text-white rounded-full text-[10px] sm:text-[11px] hover:bg-orange-700 transition">
                    Buy now
                </button>
            </div>
            </div>
        </div>
    )
}

export default ProductCard
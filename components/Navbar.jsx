"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {

  const { router, user, searchQuery, setSearchQuery, signOut } = useAppContext();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push('/all-products');
  }

  return (
    <nav className="w-full border-b border-gray-300 text-gray-700">
      <div className="site-container flex items-center justify-between py-3 gap-4">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="hidden lg:flex items-center gap-4 xl:gap-8">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about-us" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact-us" className="hover:text-gray-900 transition">
          Contact Us
        </Link>
        <Link href="/faq" className="hover:text-gray-900 transition">
          FAQ
        </Link>
        <Link href="/blog" className="hover:text-gray-900 transition">
          Blog
        </Link>

      </div>

      <ul className="hidden lg:flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5">
          <button type="submit" aria-label="Search products">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products"
            className="w-36 lg:w-44 text-sm outline-none bg-transparent"
          />
        </form>
        {user ? (
          <>
            <button onClick={() => router.push('/cart')} className="text-sm hover:text-gray-900">Cart</button>
            <button onClick={() => router.push('/my-orders')} className="text-sm hover:text-gray-900">My Orders</button>
            <button onClick={signOut} className="text-sm text-orange-600 hover:text-orange-700">Sign Out</button>
          </>
        ) : (
          <button onClick={() => router.push('/sign-in')} className="text-sm text-orange-600 hover:text-orange-700">Sign In</button>
        )}
      </ul>

      <div className="lg:hidden flex flex-col items-end gap-2 text-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/all-products')} aria-label="Search products">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          {user ? (
            <button onClick={signOut} className="text-xs text-orange-600">Sign Out</button>
          ) : (
            <button onClick={() => router.push('/sign-in')} className="text-xs text-orange-600">Sign In</button>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 max-w-[260px] text-xs">
          <Link href="/" className="hover:text-gray-900 transition whitespace-nowrap">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-gray-900 transition whitespace-nowrap">
            Shop
          </Link>
          <Link href="/about-us" className="hover:text-gray-900 transition whitespace-nowrap">
            About
          </Link>
          <Link href="/contact-us" className="hover:text-gray-900 transition whitespace-nowrap">
            Contact
          </Link>
          <Link href="/faq" className="hover:text-gray-900 transition whitespace-nowrap">
            FAQ
          </Link>
          <Link href="/blog" className="hover:text-gray-900 transition whitespace-nowrap">
            Blog
          </Link>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
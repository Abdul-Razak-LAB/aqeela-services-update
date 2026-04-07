"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {

  const { router, user, signOut } = useAppContext();

  const handleSearchSubmit = () => {
    router.push('/all-products');
  }

  return (
    <nav className="w-full text-gray-700 pt-4">
      <div className="site-container">
      <div className="flex items-center justify-between py-2.5 px-4 md:px-7 gap-3 xl:gap-4 bg-white rounded-[18px] border border-gray-200 shadow-sm">
      <div className="flex flex-1 items-center min-w-0">
      <Image
        className="cursor-pointer w-24 lg:w-28 xl:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      </div>
      <div className="hidden lg:flex flex-[1.2] min-w-0 items-center justify-center px-3 xl:px-4">
        <div className="flex w-full max-w-[420px] xl:max-w-[480px] items-center justify-between text-[13px] xl:text-sm">
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
        </div>
      </div>

      <ul className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-1.5 xl:gap-2">
        <li>
          <button onClick={handleSearchSubmit} className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </li>
        <li>
          <button onClick={() => router.push('/cart')} className="h-9 px-3 xl:px-4 border border-gray-300 rounded-full text-[11px] xl:text-xs text-gray-700 hover:bg-gray-50 transition whitespace-nowrap">
            Cart
          </button>
        </li>
        {user ? (
          <li>
            <button onClick={signOut} className="h-9 px-2.5 xl:px-3 text-[11px] xl:text-xs text-orange-600 hover:text-orange-700 whitespace-nowrap">Sign Out</button>
          </li>
        ) : (
          <li>
            <button onClick={() => router.push('/sign-in')} className="h-9 px-2.5 xl:px-3 text-[11px] xl:text-xs text-orange-600 hover:text-orange-700 whitespace-nowrap">Sign In</button>
          </li>
        )}
      </ul>

      <div className="lg:hidden flex items-center justify-end gap-2 text-[10px] leading-none whitespace-nowrap">
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
        <button onClick={() => router.push('/cart')} className="px-2 py-1 border border-gray-300 rounded-full text-[10px] text-gray-700">
          Cart
        </button>
        <button onClick={handleSearchSubmit} aria-label="Search products" className="w-5 h-5 flex items-center justify-center">
          <Image className="w-3.5 h-3.5" src={assets.search_icon} alt="search icon" />
        </button>
        {user ? (
          <button onClick={signOut} className="text-[10px] text-orange-600 whitespace-nowrap">Sign Out</button>
        ) : (
          <button onClick={() => router.push('/sign-in')} className="text-[10px] text-orange-600 whitespace-nowrap">Sign In</button>
        )}
      </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
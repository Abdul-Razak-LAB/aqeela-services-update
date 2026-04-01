"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { router, user, searchQuery, setSearchQuery } = useAppContext();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push('/all-products');
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
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
        <Link href="/blog" className="hover:text-gray-900 transition">
          Blog
        </Link>

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
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
        { 
          user 
            ? <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push("/cart")} />
              </UserButton.MenuItems>
               <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push("/my-orders")} />
              </UserButton.MenuItems>
            </UserButton>
            </> 
            : null
        }
      </ul>

      <div className="md:hidden flex flex-col items-end gap-2 text-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/all-products')} aria-label="Search products">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          {
            user
              ? <>
                <UserButton>

                  <UserButton.MenuItems>
                    <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/")} />
                  </UserButton.MenuItems>

                  <UserButton.MenuItems>
                    <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push("/all-products")} />
                  </UserButton.MenuItems>

                  <UserButton.MenuItems>
                    <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
                  </UserButton.MenuItems>

                </UserButton>
              </>
              : null
          }
        </div>

        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 max-w-[240px] text-xs">
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
          <Link href="/blog" className="hover:text-gray-900 transition whitespace-nowrap">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
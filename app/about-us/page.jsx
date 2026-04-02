'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main className="site-container py-12 min-h-[70vh]">
        <section className="max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">About Us</p>
          <h1 className="text-3xl md:text-5xl font-medium leading-tight text-gray-900">
            Helping farmers and growers get trusted products, faster.
          </h1>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
            <Image
              src={assets.k70}
              alt="Aqeela Services banner"
              className="w-full h-auto rounded-lg"
              width={1280}
              height={545}
              priority
            />
          </div>
          <p className="text-base md:text-lg text-gray-600 leading-8">
            Aqeela Services is built to make agricultural shopping simple, transparent, and reliable.
            We connect customers with quality products across fertilizers, crop care, and farm essentials,
            while focusing on clear pricing, easy ordering, and dependable delivery.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-12">
          <article className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-medium text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mt-3">Make farm inputs accessible and affordable for every customer.</p>
          </article>
          <article className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-medium text-gray-900">Our Promise</h2>
            <p className="text-gray-600 mt-3">Deliver quality products with reliable service and support.</p>
          </article>
          <article className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-medium text-gray-900">Our Vision</h2>
            <p className="text-gray-600 mt-3">Become the trusted digital partner for modern agriculture.</p>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;

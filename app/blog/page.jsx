'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  donations,
  donationInstructions,
  youthMentorshipPrograms,
} from "./donationsData";

const Blog = () => {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 py-12 min-h-[70vh]">
        <section className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">Community Impact</p>
          <h1 className="text-3xl md:text-5xl font-medium text-gray-900">Donation Moments</h1>
          <p className="text-gray-600 text-base md:text-lg">
            This page records each donation activity. Add your latest donation photos anytime and keep this story growing.
          </p>
          <p className="text-sm text-gray-500">{donationInstructions}</p>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-12">
          {donations.map((donation) => (
            <article key={donation.id} className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
              <Image
                src={donation.image}
                alt={donation.title}
                className="w-full h-44 object-cover rounded-lg"
                width={600}
                height={300}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.15em] text-green-700">Donation</span>
                <span className="text-xs text-gray-500">{donation.date}</span>
              </div>
              <h2 className="text-xl font-medium text-gray-900">{donation.title}</h2>
              <p className="text-gray-600"><span className="font-medium">Location:</span> {donation.location}</p>
              <p className="text-gray-600"><span className="font-medium">Items:</span> {donation.items}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-700">Youth Mentorship</p>
            <h2 className="text-2xl md:text-4xl font-medium text-gray-900">Growing future leaders</h2>
            <p className="text-gray-600 text-base md:text-lg">
              We also mentor young people through practical sessions that build confidence, skills, and leadership.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {youthMentorshipPrograms.map((program) => (
              <article key={program.id} className="border border-blue-100 rounded-xl p-5 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.15em] text-blue-700">Mentorship</span>
                  <span className="text-xs text-gray-500">{program.date}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900">{program.title}</h3>
                <p className="text-gray-700"><span className="font-medium">Venue:</span> {program.venue}</p>
                <p className="text-gray-700"><span className="font-medium">Focus:</span> {program.focus}</p>
                <p className="text-gray-700"><span className="font-medium">Impact:</span> {program.impact}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;

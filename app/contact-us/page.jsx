'use client'
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import Image from "next/image";
import { assets } from "@/assets/assets";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    cityArea: "",
    topic: "",
    cropType: "",
    preferredDate: "",
    preferredTime: "",
    requirement: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsultationSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to book consultation.');
        return;
      }

      toast.success('Consultation booked successfully.');
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        cityArea: "",
        topic: "",
        cropType: "",
        preferredDate: "",
        preferredTime: "",
        requirement: "",
      });
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="site-container py-12 min-h-[70vh]">
        <section className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">Contact Us</p>
          <h1 className="text-3xl md:text-5xl font-medium text-gray-900">We are here to help</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Questions about products, delivery, or orders? Reach out to our team and we will get back to you.
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
          <Image
            src={assets.k70}
            alt="Aqeela Services banner"
            className="w-full h-auto rounded-lg"
            width={1280}
            height={545}
            priority
          />
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-3">
            <h2 className="text-xl font-medium text-gray-900">Support</h2>
            <p className="text-gray-600">Email: support@aqeelaservices.com</p>
            <p className="text-gray-600">Phone: </p>
            <p className="text-gray-600">Hours: Mon - Sat, 6:00 AM - 8:00 PM</p>
          </div>

          <form className="border border-gray-200 rounded-xl p-6 bg-white space-y-4">
            <h2 className="text-xl font-medium text-gray-900">Send a message</h2>
            <input type="text" placeholder="Your name" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <input type="email" placeholder="Your email" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            <textarea rows={4} placeholder="Your message" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none" />
            <button type="button" className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg transition">
              Submit
            </button>
          </form>
        </section>

        <section className="mt-12 border border-gray-200 rounded-xl p-6 md:p-8 bg-white">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-green-700">Consultation</p>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mt-2">Book a Consultation</h2>
            <p className="text-gray-600 mt-2">
              Schedule a one-on-one consultation with our team for crop planning, fertilizer strategy,
              and weed control guidance.
            </p>
          </div>

          <form onSubmit={handleConsultationSubmit} className="grid md:grid-cols-2 gap-4 mt-6">
            <input
              name="fullName"
              type="text"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <input
              name="cityArea"
              type="text"
              placeholder="City / Area"
              value={formData.cityArea}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white"
            >
              <option value="">Consultation topic</option>
              <option value="crop-nutrition">Crop Nutrition</option>
              <option value="weed-management">Weed Management</option>
              <option value="pest-control">Pest Control</option>
              <option value="seasonal-planning">Seasonal Planning</option>
            </select>
            <input
              name="cropType"
              type="text"
              placeholder="Crop type"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <input
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <input
              name="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
            <textarea
              name="requirement"
              rows={4}
              placeholder="Briefly describe your requirement"
              value={formData.requirement}
              onChange={handleChange}
              className="md:col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white px-6 py-2.5 rounded-lg transition"
              >
                {loading ? 'Booking...' : 'Book Consultation'}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;

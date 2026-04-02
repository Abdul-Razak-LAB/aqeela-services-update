import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Subscribe now & get 10% off
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
       Let's grow together! 🌱 Reach out for partnerships, inquiries, or support.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between max-w-2xl w-full gap-2 sm:gap-0 sm:h-14">
        <input
          className="border border-gray-500/30 rounded-md sm:h-full sm:border-r-0 outline-none w-full sm:rounded-r-none px-3 py-3 sm:py-0 text-gray-500"
          type="text"
          placeholder="Enter your email id"
        />
        <button className="md:px-12 px-8 py-3 sm:py-0 sm:h-full text-white bg-orange-600 rounded-md sm:rounded-l-none">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;

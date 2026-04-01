import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.k15}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Agro products with
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          Aqeela Services
        </p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.kk5} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={assets.k6}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden"
        src={assets.k12}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default Banner;
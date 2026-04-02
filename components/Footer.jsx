import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="site-container flex flex-col md:flex-row items-start justify-between gap-8 md:gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-full md:w-2/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
           Your trusted source of all agrochemicals and farm inputs in Ghana. We're the farmers friend!
          </p>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+233 303 981 636.</p>
              <p>+233 599 988 947.</p>
              <p>+233 555 121 602.</p>
              <p>aqeelaservicesgh@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © Aqeela Services All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
"use client";
import React from "react";
import "react-toggle/style.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../assets/dLogo.png";
import lLogo from "../assets/lLogo.png";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../styles/Responsive.css";
import { Connect } from "./Connect";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className=" w-[90%] mx-auto relative navbar ">
      <div className="flex items-center justify-between  gap-y-4 my-[20px] ">
        {/* Logo Section */}
        <a href="/" aria-label="CRYPTO-COURIER" title="CRYPTO-COURIER">
          <div className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo">
            {theme === "light" ? (
              <Image
                src={dLogo}
                alt="CRYPTO-COURIER Dark Logo"
                width={400}
                height={400}
                className="w-full h-auto "
              />
            ) : (
              <Image
                src={lLogo}
                alt="CRYPTO-COURIER Light Logo"
                width={400}
                height={400}
                className="w-full h-auto "
              />
            )}
          </div>
        </a>

        {/* Right Section: Theme Toggle and Connect Button */}
        <div className="flex items-center space-x-4 flex-row-reverse lg:flex-row md:flex-row sm:flex-row">
        <ThemeToggle />
          <Connect />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

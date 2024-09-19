"use client";
import React from "react";
import "react-toggle/style.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../assets/dLogo.png";
import lLogo from "../assets/lLogo.png";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="pt-5  mx-auto w-[90%]">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="CRYPTO-COURIER" title="CRYPTO-COURIER">
          {theme === "light" ? (
            <Image
              src={dLogo}
              alt="CRYPTO-COURIER Dark Logo"
              width={300}
              height={300}
            />
          ) : (
            <Image
              src={lLogo}
              alt="CRYPTO-COURIER Light Logo"
              width={300}
              height={300}
            />
          )}
        </a>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

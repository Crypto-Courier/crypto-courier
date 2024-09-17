import React from "react";
import "react-toggle/style.css";
import WalletButtons from "./Connect";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "next-themes";
import dLogo from "../assets/dLogo.png";
import lLogo from "../assets/lLogo.png";
import Image from "next/image";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="pt-5 pb-5 mx-auto w-[90%]">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="CRYPTO-COURIER" title="CRYPTO-COURIER">
          {theme === "dark" ? (
            <Image
              src={dLogo}
              alt="CRYPTO-COURIER Dark Logo"
              className="h-8"
              width={30}
            />
          ) : (
            <Image
              src={lLogo}
              alt="CRYPTO-COURIER Light Logo"
              className="h-8"
              width={30}
            />
          )}
        </a>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <WalletButtons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

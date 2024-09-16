import React from "react";
import "react-toggle/style.css";
import WalletButtons from "./Connect";
import { ThemeToggle } from "../components/ThemeToggle";

const Navbar = () => {
  return (
    <div className="pt-5 pb-5 mx-auto w-[90%]">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="StakeEasy" title="StakeEasy">
          <h1>CRYPTO-COURIER</h1>
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

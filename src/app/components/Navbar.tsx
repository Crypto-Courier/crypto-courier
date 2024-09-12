import React from "react";

import WalletButtons from "./Connect";

const Navbar = () => {
  return (
    <div className="pt-5 pb-5 mx-auto  w-[90%] ">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="StakeEasy" title="StakeEasy">
          <h1>Hello</h1>
        </a>
        <div className="flex items-center">
          <WalletButtons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

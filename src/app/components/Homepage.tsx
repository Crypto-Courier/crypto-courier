"use client";
import { useTheme } from "next-themes";

import React from "react";
import send2 from "../assets/Tcircle2.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TokenCircles from "../assets/token.png";
import send from "../assets/send.png";
import "../styles/homepage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Homepage() {
  const router = useRouter();
  const { theme } = useTheme();

  const OpenHistory = () => {
    router.push("/transaction-history"); // Replace "/send" with the route you want to navigate to
  };

  return (
    <div className="main">
      <Navbar />
      <div className=" ">
        <div className="flex justify-center items-center">
          <div
            className={`border-y w-full ${
              theme === "light" ? "border-black" : "border-white"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between w-[90%] mx-auto h-max">
              <div
                className={`flex items-center h-[225px] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[600] md:border-r-2 md:rounded-r-[100px] md:pr-8 pb-4 md:pb-0 w-[70%] ${
                  theme === "light" ? "md:border-r-black" : "md:border-r-white"
                }`}
              >
                Send your tokens
              </div>
              <div className="mt-4 md:mt-0 h-[225px]">
                <Image
                  src={TokenCircles}
                  alt="Token circles"
                  className="h-[225px] max-w-xs md:max-w-sm py-5 w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-[70px]">
          <div className="flex flex-col sm:flex-row items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl w-[100%] mx-auto text-center space-y-4 sm:space-y-0 sm:space-x-4 font-[600]">
            <div>Tron</div>
            <div>
              {theme === "light" ? (
                <Image
                  src={send2}
                  alt="send email"
                  className="w-16 sm:w-20 md:w-24 h-full inline-flex"
                />
              ) : (
                <Image
                  src={send}
                  alt="send email"
                  className="w-16 sm:w-20 md:w-24 h-full inline-flex"
                />
              )}
            </div>
            <div>email to anyone</div>
          </div>
        </div>
        <div>
          <div className="sec3Bg">
            <div className="s3div">
              <div className="s3subdiv">
                <button
                  className="send px-6 py-3 text-lg sm:text-xl md:text-2xl rounded-full w-[25%]"
                  onClick={OpenHistory}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;

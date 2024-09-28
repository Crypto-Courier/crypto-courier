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
    router.push("/transaction-history"); // Navigate to the desired route
  };

  return (
    <div className="main min-h-screen flex flex-col ">
      <Navbar />
      <div className="flex-grow flex flex-col justify-between ">
        
          <div
            className={`border-y w-full my-6 flex justify-center items-center flex-grow h-[20vh] ${
              theme === "light" ? "border-black" : "border-white"
            }`}
          >
            <div className="flex lg:flex-row md:flex-row items-center justify-between w-[90%] mx-auto  flex-col">
              <div
                className={`flex items-center sm:h-[175px]  lg:h-[200px] md:h-[160px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[600] lg:border-r-2 lg:rounded-r-[100px] md:border-r-2 md:rounded-r-[100px] md:pr-8 pb-4 md:pb-0 w-full md:w-[60%] lg:w-[60%] text-center md:text-left justify-center ${
                  theme === "light" ? "border-black" : "border-white"
                }`}
              >
                Send your tokens
              </div>
              <div className="mt-4 md:mt-0  sm:h-[175px]  lg:h-[200px]  md:h-[160px] w-full md:w-auto flex justify-center md:justify-end">
                <Image
                  src={TokenCircles}
                  alt="Token circles"
                  className="sm:h-[175px]  md:h-[160px] lg:h-[200px] w-auto py-5"
                />
              </div>
            </div>
          </div>
       
        <div className="py-10 h-[20vh]  w-[90%] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center text-6xl sm:text-5xl md:text-6xl lg:text-7xl w-full mx-auto text-center space-y-4 sm:space-y-0 sm:space-x-4 font-[600]">
            <div>CryptoCourier</div>
            <div>
              {theme === "light" ? (
                <Image
                  src={send2}
                  alt="send email"
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-full inline-flex"
                />
              ) : (
                <Image
                  src={send}
                  alt="send email"
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-full inline-flex"
                />
              )}
            </div>
            <div>email to anyone</div>
          </div>
        </div>

        <div className="sec3Bg relative h-[20vh] flex-grow flex items-center">
          <div className="s3div">
            <div className="s3subdiv flex justify-center">
              <button
                className="hover:scale-110 duration-500 transition 0.3 send px-6 py-3 text-base sm:text-lg md:text-xl lg:text-2xl rounded-full z-40 relative w-full sm:w-[50%] md:w-[40%] lg:w-[25%] max-w-[300px] bg-[#FFFFFF]/25"
                onClick={OpenHistory}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;

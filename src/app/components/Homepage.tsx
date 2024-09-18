"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TokenCircles from "../assets/token.png";
import send from "../assets/send.png";
import "../styles/homepage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Homepage() {
  const router = useRouter();

  const OpenHistory = () => {
    router.push("/transaction-history"); // Replace "/send" with the route you want to navigate to
  };

  return (
    <div className="main">
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="border-y w-full">
          <div className="flex flex-col md:flex-row items-center justify-between w-[90%] mx-auto py-8">
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold md:border-r-2 md:rounded-r-[100px] md:pr-8 pb-4 md:pb-0">
              Send your tokens
            </div>
            <div className="mt-4 md:mt-0">
              <Image
                src={TokenCircles}
                alt="Token circles"
                className="w-full max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl w-[90%] mx-auto text-center space-y-4 sm:space-y-0 sm:space-x-4">
          <span>Tron</span>
          <div className="w-16 sm:w-20 md:w-24">
            <Image src={send} alt="send email" />
          </div>
          <span>email to anyone</span>
        </div>
      </div>
      <div>
        <div className="sec3Bg">
          <div className="s3div">
            <div className="s3subdiv">
              <button
                className="send px-6 py-3 text-lg sm:text-xl md:text-2xl"
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

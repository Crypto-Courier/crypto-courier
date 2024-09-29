"use client";
import React, { use, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { X, Copy } from "lucide-react";
import {PrivyProvider, usePrivy} from '@privy-io/react-auth';

function ClaimToken() {
  const { theme } = useTheme();
  
  const router = useRouter();

  const OpenDashboard = () => {
    router.push("/dashboard"); // Replace "/send" with the route you want to navigate to
  };
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when unmounted
    };
  }, []);



  return (
    <div>
      <Navbar />
      <div className="txbgg flex justify-center items-center ">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-[10px] max-w-[35rem] w-full mx-3 relative ${
              theme === "dark"
                ? "bg-[#000000] border-red-500 border backdrop-blur-[10px]"
                : "bg-[#FFFCFC] border border-[#FE005B]/60"
            }`}
          >
            <div
              className={`flex justify-center items-center p-6 rounded-tr-[10px] rounded-tl-[10px] ${
                theme === "dark"
                  ? "bg-[#171717] border-b-2 border-red-500"
                  : "bg-white border-b-2 border-[#FE005B]"
              }`}
            >
              <div className="flex items-center flex-col">
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Sign-UP to Claim Tokens
                </h2>
              </div>
            </div>

            <div className="px-6 py-[3rem]">
              <h3
                className={`text-[18px] mb-4 text-center font-semibold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                This Claim has already been claimed 🎉
              </h3>

              <button
              onClick={OpenDashboard}
              className={`${
                theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
              } w-[50%] text-white py-2 rounded-[10px] flex items-center justify-center mb-6 mx-auto`}
              >
              Go to Dashboard
              </button>

             
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

interface PrivyWrapperProps {
  children: React.ReactNode;
}

const PrivyWrapper: React.FC = () => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      <ClaimToken />
    </PrivyProvider>
  );
};

export default PrivyWrapper;

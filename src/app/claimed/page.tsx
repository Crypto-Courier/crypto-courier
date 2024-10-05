"use client";
import React, { useRef, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {PrivyProvider, usePrivy} from '@privy-io/react-auth';
import lLogo from "../../assets/lLogo.png"
import Image from "next/image";
import dLogo from "../../assets/dLogo.png"
import { X } from "lucide-react"; // You can replace this with an actual icon library

function ClaimToken() {
  const { theme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref
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

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };


   // Close the help popup if clicking outside of it
   useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false); // Close the popup
      }
    }
    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHelp]);


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
      <button
        className={`fixed bottom-4 right-4 bg-[#FF3333] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 ${
          !showHelp ? "animate-pulse" : ""
        }`}
        onClick={toggleHelp}
        onMouseEnter={() => setTooltipVisible(true)} // Show tooltip on hover
        onMouseLeave={() => setTooltipVisible(false)} // Hide tooltip when not hovering
      >
        {showHelp ? (
          <X className="w-6 h-6" /> // Close icon when popup is open
        ) : (
          "?" // Pulsing Question mark icon when popup is closed
        )}
      </button>

      {/* Tooltip */}
      {tooltipVisible && !showHelp && (
        <div className= {`absolute bottom-16 right-1 text-sm rounded-lg px-3 py-1 z-50 shadow-lg mb-2 ${theme==="dark"?"bg-[#FFFFFF] text-blue-700":"bg-[#1C1C1C] text-[#FFE500]"}`}>
          Help Center
        </div>
      )}
    {/* Help Popup */}
{showHelp && (
  <div
  ref={helpRef}
    className= {`border border-[#FF3333] fixed  p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[60vh] z-50 overflow-y-auto scroll ${theme==="dark"?"bg-black":"bg-white"}`}
    style={{
      position: "absolute",
      top: "30%", // Slightly adjusted top for better viewing on smaller screens
      right: "10px", // Aligns with the button's right side
    }}
  >
    <div>
    <div className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo" style={{marginLeft:"-17px"}}>
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
<div>
      <h2 className="text-xl font-bold mb-4 ">Help Information</h2>
      <p className="">
        CryptoCourier allows you to send tokens to anyone using their email address. Here's how it works:
      </p>
      <ul className="list-disc list-inside mt-2 mb-4 ">
        <li>Connect your wallet</li>
        <li>Click the "Send" button</li>
        <li>Enter the recipient's email and the amount of tokens</li>
        <li>Confirm the transaction</li>
      </ul>
      <p className="">
        The recipient will receive an email with instructions on how to claim their tokens.
      </p>
      
    </div>
  </div>
  </div>
)}
    </div>
  );
}

// interface PrivyWrapperProps {
//   children: React.ReactNode;
// }

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

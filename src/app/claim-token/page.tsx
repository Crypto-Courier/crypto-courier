"use client";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { useRouter } from "next/navigation";
import spin from "../../assets/spinner.gif";
import lLogo from "../../assets/lLogo.png"
import Image from "next/image";
import dLogo from "../../assets/dLogo.png"
import { X } from "lucide-react"; // You can replace this with an actual icon library

function ClaimToken() {
  const { theme } = useTheme();
  const { login, authenticated, ready, user } = usePrivy();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(true); // Tooltip visibility state
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref

  // Prevent background scrolling when modal is open
  // Close the help popup if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when unmounted
    };
  }, []);

  useEffect(() => {
    if (ready) {
      setIsAuthenticated(authenticated);
    }
  }, [ready, authenticated]);

  useEffect(() => {
    const handleAuthenticationAndRedirect = async () => {
      if (ready && authenticated && user?.wallet?.address && !isRedirecting) {
        setIsRedirecting(true);
        // Add a small delay to ensure wallet state is properly initialized
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          const response = await fetch('/api/auth-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: user.wallet.address,
              authenticated: true
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update authentication status');
          }
        } catch (error) {
          console.error('Error updating authentication status:', error);
        }

        router.push(`/dashboard/${user.wallet.address}`);
      }
    };

    handleAuthenticationAndRedirect();
  }, [ready, authenticated, user, router, isRedirecting])

  const handleClaim = async () => {
    if (!authenticated) {
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
        setIsRedirecting(false);
      }
    }
  };

  if (!ready) {
    return <div className="flex justify-center items-center h-[100vh]"> <Image src={spin} alt="Loading..." width={100} /></div>;
  }

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div>
      <Navbar />
      <div className="txbgg flex justify-center items-center ">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-[10px] max-w-[40rem] w-full mx-3 relative ${theme === "dark"
                ? "bg-[#000000] border-red-500 border backdrop-blur-[10px]"
                : "bg-[#FFFCFC] border border-[#FE005B]/60"
              }`}
          >
            <div
              className={`flex justify-center items-center p-6 rounded-tr-[10px] rounded-tl-[10px] ${theme === "dark"
                  ? "bg-[#171717] border-b-2 border-red-500"
                  : "bg-white border-b-2 border-[#FE005B]"
                }`}
            >
              <div className="flex items-center flex-col">
                <h2
                  className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"
                    }`}
                >
                  Sign-UP to Claim Tokens
                </h2>
              </div>
            </div>

            <div className="px-6 py-[3rem]">
              <h3
                className={`text-[18px] mb-4 text-center font-semibold ${theme === "dark" ? "text-white" : "text-black"
                  }`}
              >
                Your crypto adventure begins here.😍
              </h3>

              <button
                onClick={handleClaim}
                className={`${theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                  } w-[50%] text-white py-2 rounded-[10px] flex items-center justify-center mb-6 mx-auto relative`}
                onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
                onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
              >
                {isAuthenticated ? `Go to Dashboard`:`Login to Claim Tokens`}
              </button>
              {showTooltip && (
                <div className={`z-50 absolute top-[70px] left-1/2  border border-red-300 rounded-lg p-3 w-[50%] m-auto  ${theme === "dark"
                    ? "bg-[#000000]  text-white text-sm"
                    : "bg-[#FFFFFF]  text-black text-sm z-50"
                  }`}>
                  When you click on the Button then you will be authenticated through privy. Make sure to enter the email in which you got tokens.        
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <button
        className={`fixed bottom-4 right-4 bg-[#FF3333] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 ${!showHelp ? "animate-pulse" : ""
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
        <div className={`absolute bottom-16 right-1 text-sm rounded-lg px-3 py-1 z-50 shadow-lg mb-2 ${theme === "dark" ? "bg-[#FFFFFF] text-blue-700" : "bg-[#1C1C1C] text-[#FFE500]"}`}>
          Help Center
        </div>
      )}
      {/* Help Popup */}
      {showHelp && (
        <div
          ref={helpRef}
          className={`border border-[#FF3333] fixed  p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[60vh] z-50 overflow-y-auto scroll ${theme === "dark" ? "bg-black" : "bg-white"}`}
          style={{
            position: "absolute",
            top: "30%", // Slightly adjusted top for better viewing on smaller screens
            right: "10px", // Aligns with the button's right side
          }}
        >
          <div>
            <div className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo" style={{ marginLeft: "-17px" }}>
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
              CryptoCourier makes it easy for you to send tokens to anyone using just their email address,
              even if they are new to crypto.
              </p>
              <p className="mt-2"><strong> About the Page: </strong></p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>
                To claim your token, you need to verify your identity using Privy.
                </li>
                <li>
                Simply click on "Login to claim," then enter the email address where you received your tokens.
                </li>
                <li>
                Check your email for a One-Time Password (OTP), enter it, and you'll be verified.
                </li>
                <li>
                After waiting for 2-5 seconds, you will be taken to your dashboard.
                </li>
              </ul>
              <p><strong>Why do you need to verify?</strong></p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li> You must verify your identity to claim the token. </li>
                <li> This process ensures that only the rightful person can claim the token. </li>
                <li> It adds an extra layer of security to protect your wallet and data. </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

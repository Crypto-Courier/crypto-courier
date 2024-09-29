"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useTheme } from "next-themes";
import { X, Copy } from "lucide-react";
import {PrivyProvider, usePrivy} from '@privy-io/react-auth';
import { useSearchParams, useRouter } from "next/navigation";

function ClaimToken() {
  const { theme } = useTheme();
  const { login, authenticated, ready, user } = usePrivy();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchparams=useSearchParams();
  const router = useRouter();
  const amount=searchparams?.get('amount');
  console.log("Line number 17:",amount);
  const symbol=searchparams?.get('symbol')
  console.log(symbol);

  // Prevent background scrolling when modal is open
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

  const handleClaim = async () => {
    if (!authenticated) {
      await login();
    }
    if (authenticated && user?.wallet?.address) {
      router.push(`/dashboard/${user.wallet.address}`);
    }
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="txbgg flex justify-center items-center ">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-[10px] max-w-[40rem] w-full mx-3 relative ${
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
                Your crypto adventure begins here.😍
              </h3>

              <button
              onClick={handleClaim}
              className={`${
                theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
              } w-[50%] text-white py-2 rounded-[10px] flex items-center justify-center mb-6 mx-auto`}
              >
                {isAuthenticated ? `Claim Your Tokens` : "Login to Claim"}
              </button>

              <div
                className={`border border-red-300 rounded-lg p-3 w-[90%] m-auto ${
                  theme === "dark"
                    ? "bg-[#FF3333]/6 bg-opacity-50 backdrop-blur-[10px] text-[#FF3333]"
                    : ""
                }`}
              >
                <p
                  className={`text-sm   font-semibold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Info:
                  <br />
                  When you click on the Button then you will be authenticated through privy. <br /> Make sure to enter the email in which you got tokens.
                </p>
              </div>
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

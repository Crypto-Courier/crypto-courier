"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { Search } from "lucide-react";
import "../../styles/History.css";
import { ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAccount, useSendTransaction, useBalance } from "wagmi";
import { parseUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";
import { Copy, CheckCircle } from "lucide-react";
import token from "../../assets/assets.png";
import { useTheme } from "next-themes";
import profile from "../../assets/profile.png";
import defaultTokenImage from "../../assets/assets.png"; // Add this import
import { useRouter } from "next/navigation";
import { sendEmail } from "../../components/Email/Emailer";
import Email from "../../components/Email/Email";
import TxDetails from "../../components/TxDetails";
import AddTokenForm from "./AddTokenForm";
import Image from "next/image";
import lLogo from "../../assets/lLogo.png"
import dLogo from "../../assets/dLogo.png"
import { X } from "lucide-react"; // You can replace this with an actual icon library
import { NewToken, LinkedAccount, TokenWithBalance, ApiResponse } from "../../types/types";

const SendToken = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useAccount();
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const totalBalance = useBalance({ address });
  const { data: hash, sendTransaction } = useSendTransaction();
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [maxAmount, setMaxAmount] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // const [txHash, setTxHash] = useState("");
  const OpenHistory = () => {
    router.push("/transaction-history"); // Replace "/send" with the route you want to navigate to
  };

  const popupRef = useRef(null); // Reference for the popup element

  const [newToken, setNewToken] = useState<{
    contractAddress: string;
    name: string;
    symbol: string;
    decimals: number | null; // Allow both null and number
  }>({
    contractAddress: "",
    name: "",
    symbol: "",
    decimals: null, // Initial value is null
  });

  useEffect(() => {
    if (address) {
      fetchTokens();
    }
  }, [address]);

  useEffect(() => {
    if (hash) {
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      if (selectedTokenData) {
        const emailContent = renderToString(
          <Email
            recipientEmail={recipientEmail}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenData.symbol}
          />
        );
        sendEmail({
          recipientEmail,
          subject: "Hooray! You got some crypto coin 🪙",
          htmlContent: emailContent,
          tokenAmount,
          tokenSymbol: selectedTokenData.symbol,
        });
        StoreTransactionData(
          recipientWalletAddress,
          address as `0x${string}`,
          tokenAmount,
          selectedTokenData.symbol,
          recipientEmail
        );
      }
    }
  }, [hash]);

  useEffect(() => {
    if (selectedToken) {
      updateMaxAmount();
    }
  }, [selectedToken, tokens]);

  const updateMaxAmount = () => {
    const selectedTokenData = tokens.find(
      (t) => t.contractAddress === selectedToken
    );
    if (selectedTokenData) {
      setMaxAmount(selectedTokenData.balance);
    }
  };

  const fetchTokenDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsFetching(true);

    try {
      const res = await fetch("/api/getTokenDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenAddress: newToken.contractAddress }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setTokenDetails(data);
        setNewToken({
          ...newToken,
          name: data.name,
          symbol: data.symbol,
          decimals: Number(data.decimals),
        });
      } else {
        setError(data.message || "Error fetching token details");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchTokens = async () => {
    if (!address) {
      console.error("No address available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-tokens?address=${address}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tokenData = await response.json();
      console.log("Fetched token data:", tokenData);

      if (Array.isArray(tokenData) && tokenData.length > 0) {
        setTokens(tokenData);
        setSelectedToken(tokenData[0].contractAddress);
      } else {
        console.warn("No tokens found or invalid data structure");
        setTokens([]);
      }

      // setTokens(Array.isArray(tokenData) ? tokenData : []);
      // if (tokenData.length > 0) {
      //   setSelectedToken(tokenData[0].contractAddress);
      // }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast.error("Failed to fetch tokens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedToken = e.target.value;
    setSelectedToken(newSelectedToken);
    const selectedTokenData = tokens.find(
      (t) => t.contractAddress === newSelectedToken
    );
    if (selectedTokenData) {
      setTokenAmount(selectedTokenData.balance);
    }
  };

  const handleMaxClick = () => {
    setTokenAmount(maxAmount);
  };

  const copyToClipboard = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Tx hash copied to clipboard");
    }
  };

  const StoreTransactionData = async (
    walletAddress: string,
    address: string,
    tokenAmount: string,
    selectedTokenData: string,
    recipientEmail: string
  ) => {
    const storeResponse = await fetch("/api/store-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientWallet: walletAddress,
        senderWallet: address,
        tokenAmount,
        tokenSymbol: selectedTokenData,
        recipientEmail,
        transactionHash: hash,
      }),
    });

    if (storeResponse.ok) {
      console.log("Transaction stored successfully");
      toast.success(
        "Transaction completed! Email sent to recipient successfully."
      );
    } else {
      console.error("Failed to store transaction");
      toast.error(
        "Transaction completed but failed to send email to recipient"
      );
    }
  };

  const handleSend = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      console.log("Selected token data:", selectedTokenData);
      if (!selectedTokenData) {
        throw new Error("Selected token not found");
      }

      const amountInWei = parseUnits(tokenAmount, selectedTokenData.decimals);
      console.log("Amount in Wei:", amountInWei);

      const tx = await sendTransaction({
        to: walletAddress as `0x${string}`,
        value: amountInWei,
      });

      console.log("Transaction sent:", tx);
      setRecipientWalletAddress(walletAddress);
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast.error("Failed to send transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async (newToken: NewToken) => {
    try {
      const response = await fetch("/api/add-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToken),
      });

      if (response.ok) {
        setShowAddTokenForm(false);
        // Optionally refresh token list or show success message
        fetchTokens(); // Assuming you have a function to refresh the token list
        toast.success("Token added successfully");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add token");
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };


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

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[4rem] ">
          <div
            className={`flex justify-between border-black border-b-0 px-[30px] py-[20px] ${theme === "dark" ? "bg-black" : "bg-white"
              } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`flex items-center space-x-3 p-2 rounded-[10px] ${theme === "dark"
                ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                : "bg-[#F4F3F3] border border-[#C6C6C6]"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${theme === "dark"
                  ? "border-white bg-transparent"
                  : "border-gray-500 bg-transparent"
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-[#FFE500] text-[#363535]"
                  : "bg-[#E265FF] text-white"
                  }`}>
                </div>
              </div>
              <span className="font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connect Wallet"}
              </span>
            </div>
            <div className="text-right flex items-end">
              {/* <div>
                <div className="text-[18px] text-black-600 py-1 font-[500] text-start">
                  Your balance
                </div>
                <div
                  className={`text-[25px] font-bold   py-1 px-3 rounded-[10px] ${theme === "dark"
                    ? "text-[#FFE500] border border-[#A2A2A2] bg-[#1C1C1C]"
                    : "text-[#E265FF] border border-gray"
                    }`}
                >
                  $1234.56
                </div>
              </div> */}

              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${theme === "dark"
                  ? "bg-[#FFE500] text-[#363535]"
                  : "bg-[#E265FF] text-white"
                  }`}
                onClick={OpenHistory}
              >
                Transaction History
              </button>
            </div>
          </div>
          <div
            className={`${theme === "dark"
              ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
              : "bg-white/80 backdrop-blur-[80px]"
              } rounded-br-[40px] rounded-bl-[40px] flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[20px] py-[20px] justify-between items-end gap-[20px]`}
          >
            {" "}
            <div className="w-full md:w-[100%] ">
              <div className="flex justify-between mx-5 ">
                {" "}
                <h3
                  className={`text-[20px] font-medium   ${theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                    }`}
                >
                  All assets
                </h3>
                <button
                  onClick={() => setShowAddTokenForm(true)}
                  className={` hover:scale-110 duration-500 transition 0.3 ${theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                    }  px-4 py-2 rounded-full text-sm`}
                >
                  Add Token
                </button>
              </div>
              {/* <div className="flex justify-center items-center mt-6">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 12.293a1 1 0 011.414 0l4.29 4.29a1 1 0 01-1.414 1.415l-4.29-4.29a1 1 0 010-1.414zM8.5 14a5.5 5.5 0 100-11 5.5 5.5 0 000 11zm0 1a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div> */}

              <div className="h-[30vh] overflow-y-auto scroll mt-[15px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-center text-gray-500 text-[18px]">
                      Loading tokens...
                    </span>
                  </div>
                ) : tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <div
                      key={index}
                      className={`${theme === "dark"
                        ? "bg-[#000000]/50 border border-white"
                        : " bg-[#FFFCFC]"
                        } flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 my-4 mx-4`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={` font-bold ${theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                          {token.symbol}
                        </span>
                        <span> - {token.name} </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {parseFloat(token.balance).toFixed(4)}
                        </div>
                        {/* <div className="text-xs text-gray-600">
                          {token.rawBalance}
                        </div> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span
                      className={` ${theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                        } text-center text-gray-500 text-[18px]`}
                    >
                      {isConnected ? `No Tokens Found` : `Connect wallet first`}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-[95%] m-auto">
              <div>
                <label
                  className={`block text-lg font-[500]  mb-1 ${theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                    }`}
                >
                  Enter token amount to send
                </label>
                <div className="flex space-x-2 justify-end">
                  <div
                    className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${theme === "dark"
                      ? "bg-[#000000]/50 border border-white"
                      : " bg-[#FFFCFC] border border-gray-700"
                      }`}
                  >
                    <input
                      type="text"
                      placeholder=" token amount "
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className={`w-full bg-transparent outline-none ${theme === "dark" ? "text-white" : "text-gray-800 "
                        } `}
                    />
                    <button
                      onClick={handleMaxClick}
                      className={`text-[12px] border  border-gray rounded-[5px] px-3 py-1 font-bold opacity-1 hover:opacity-[0.7] ${theme === "dark" ? "text-[#E265FF]" : "text-[#FF336A]"
                        }`}
                    >
                      Max
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedToken}
                      onChange={handleChange}
                      className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center  outline-none ${theme === "dark"
                        ? "bg-[#000000]/50 border border-white"
                        : " bg-[#FFFCFC] border border-gray-700"
                        }`}
                    >
                      <option
                        value=""
                        disabled
                        selected
                        className={` text-black hover:bg-gray-200 bg-opacity-50 ${theme === "dark"
                          ? "bg-[#000000]/100 border border-white text-white"
                          : " bg-[#FFFCFC] border border-gray-700 text-black "
                          }`}
                      >
                        Select a token
                      </option>
                      {Array.isArray(tokens) &&
                        tokens.map((token) => (
                          <option
                            key={token.contractAddress}
                            value={token.contractAddress}
                            className={` text-black hover:bg-gray-200 bg-opacity-50 ${theme === "dark"
                              ? "bg-[#000000]/100 border border-white text-white"
                              : "bg-[#FFFCFC] border border-gray-700 text-black "
                              }`}
                          >
                            {token.symbol}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className={`block text-lg font-[500]  mb-1 ${theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                    }`}
                >
                  Enter recipient's email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient's email address"
                  className={`w-full bg-opacity-50 rounded-xl p-3 mb-3 r  outline-none${theme === "dark"
                    ? "bg-[#000000]/50 border border-white"
                    : " bg-[#FFFCFC] border border-gray-700"
                    }`}
                />
              </div>

              <div className="flex  pt-3 space-x-7">
                <button className="px-10 py-2 rounded-full border border-[#FF336A] text-[#FF336A] font-medium ">
                  CANCEL
                </button>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  disabled={isLoading}
                  className="hover:scale-110 duration-500 transition 0.3 px-10 py-2 rounded-full border border-red-300 text-white font-medium bg-[#FF336A]"
                >
                  {isLoading ? "SEND" : "SEND"}
                </button>
              </div>
              {hash && (
                <div className="mt-5">
                  <label
                    className={`block text-lg font-[500]  mb-1 ${theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                      }`}
                  >
                    Txn Hash:
                  </label>
                  <div
                    className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${theme === "dark"
                      ? "bg-[#000000]/50 border border-white"
                      : " bg-[#FFFCFC]"
                      }`}
                  >
                    {hash ? `${hash.slice(0, 20)}...${hash.slice(-7)}` : ""}

                    <button
                      className={`p-1 text-[#FF336A] transition-colors ${copied ? "text-[#FF336A]" : ""
                        }`}
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <TxDetails
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedToken}
            recipientEmail={recipientEmail}
            onConfirm={handleSend}
          />
        </div>

        {showAddTokenForm && (
          <AddTokenForm
            onClose={() => setShowAddTokenForm(false)}
            onAddToken={handleAddToken}
          />
        )}
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

      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",

            borderImageSlice: 1,
            background: theme === "dark" ? "white" : "black",
            color: theme === "dark" ? "black" : "white",
          },
        }}
      />
    </div>
  );
};

export default SendToken;

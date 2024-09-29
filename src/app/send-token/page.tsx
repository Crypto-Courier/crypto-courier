"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { Search } from "lucide-react";
import "../styles/History.css";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount, useSendTransaction, useBalance } from "wagmi";
import { parseUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";
import { Copy, CheckCircle } from "lucide-react";
import token from "../assets/assets.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import profile from "../assets/profile.png";
import defaultTokenImage from "../assets/assets.png"; // Add this import
import { useRouter } from "next/navigation";
import { sendEmail } from "../components/Email/Emailer";
import Email from "../components/Email/Email";
import Wallet from "../components/Wallet";
import TxDetails from "../components/TxDetails";
import AddTokenForm from "./AddTokenForm";
import { NewToken, LinkedAccount, TokenWithBalance } from "../../types/types";

interface ApiResponse {
  id: string;
  created_at: number;
  linked_accounts: LinkedAccount[];
  mfa_methods: any[];
  has_accepted_terms: boolean;
  is_guest: boolean;
}

const SendToken = () => {
  const { address } = useAccount();
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
      toast.success("Transaction completed! Email sent to recipient successfully.");
    } else {
      console.error("Failed to store transaction");
      toast.error("Transaction completed but failed to send email to recipient");
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

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[4rem] ">
          <div
            className={`flex justify-between border-black border-b-0 px-[30px] py-[20px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`flex items-center space-x-3 p-2 rounded-[10px] ${
                theme === "dark"
                  ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                  : "bg-[#F4F3F3] border border-[#C6C6C6]"
              }`}
            >
              <div className="w-5 h-auto lg:w-10 md:w-5 sm:w-10 bg-gray-300 rounded-full hidden lg:flex md:flex sm:flex">
                <Image src={profile} alt="" />
              </div>
              <span className="font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "0x97C686c171a63cbDC3d7A7EbB952Cf0Fea831091"}
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
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                  theme === "dark"
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
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[20px] py-[20px] justify-between items-start gap-[20px]`}
          >
            {" "}
            <div className="w-full md:w-[100%] ">
              <div className="flex justify-between mx-5 ">
                {" "}
                <h3
                  className={`text-[20px] font-medium   ${
                    theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                  }`}
                >
                  All assets
                </h3>
                <button
                  onClick={() => setShowAddTokenForm(true)}
                  className={` hover:scale-110 duration-500 transition 0.3 ${
                    theme === "dark"
                      ? "bg-[#FFE500] text-[#363535]"
                      : "bg-[#E265FF] text-white"
                  }  px-4 py-2 rounded-full text-sm`}
                >
                  Add Token
                </button>
              </div>

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
                      className={`${
                        theme === "dark"
                          ? "bg-[#000000]/50 border border-white"
                          : " bg-[#FFFCFC]"
                      } flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 my-4 mx-4`}
                    >
                      <div className="flex items-center space-x-2">
                        {/* <Image
                          src={defaultTokenImage}
                          alt={token.symbol || "Token"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        /> */}
                        <span
                          className={` font-bold ${
                            theme === "dark" ? "text-white" : "text-black"
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
                      className={` ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                      } text-center text-gray-500 text-[18px]`}
                    >
                      No tokens found
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-[95%] m-auto">
              <div>
                <label
                  className={`block text-lg font-[500]  mb-1 ${
                    theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                  }`}
                >
                  Enter token amount to send
                </label>
                <div className="flex space-x-2 justify-end">
                  <div
                    className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${
                      theme === "dark"
                        ? "bg-[#000000]/50 border border-white"
                        : " bg-[#FFFCFC] border border-gray-700"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder=" token amount "
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className={`w-full bg-transparent outline-none ${
                        theme === "dark" ? "text-white" : "text-gray-800 "
                      } `}
                    />
                    <button
                      onClick={handleMaxClick}
                      className={`text-[12px] border  border-gray rounded-[5px] px-3 py-1 font-bold ${
                        theme === "dark" ? "text-[#E265FF]" : "text-[#FF336A]"
                      }`}
                    >
                      Max
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedToken}
                      onChange={handleChange}
                      className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center  outline-none ${
                        theme === "dark"
                          ? "bg-[#000000]/50 border border-white"
                          : " bg-[#FFFCFC] border border-gray-700"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        selected
                        className={` text-black hover:bg-gray-200 bg-opacity-50 ${
                          theme === "dark"
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
                            className={` text-black hover:bg-gray-200 bg-opacity-50 ${
                              theme === "dark"
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
                  className={`block text-lg font-[500]  mb-1 ${
                    theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                  }`}
                >
                  Enter recipient's email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient's email address"
                  className={`w-full bg-opacity-50 rounded-xl p-3 mb-3 r  outline-none${
                    theme === "dark"
                      ? "bg-[#000000]/50 border border-white"
                      : " bg-[#FFFCFC] border border-gray-700"
                  }`}
                />
              </div>

              <div className="flex  pt-6 space-x-7">
                <button className="px-6 py-3 rounded-full border border-[#FF336A] text-[#FF336A] font-medium ">
                  CANCEL
                </button>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  disabled={isLoading}
                  className="hover:scale-110 duration-500 transition 0.3 px-9 py-3 rounded-full border border-red-300 text-white font-medium bg-[#FF336A]"
                >
                  {isLoading ? "SENDING..." : "SEND"}
                </button>
              </div>
              {hash && (
                <div className="mt-5">
                  <label
                    className={`block text-lg font-[500]  mb-1 ${
                      theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                    }`}
                  >
                    Txn Hash:
                  </label>
                  <div
                    className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${
                      theme === "dark"
                        ? "bg-[#000000]/50 border border-white"
                        : " bg-[#FFFCFC]"
                    }`}
                  >
                    {hash ? `${hash.slice(0, 20)}...${hash.slice(-7)}` : ""}

                    <button
                      className={`p-1 text-[#FF336A] transition-colors ${
                        copied ? "text-[#FF336A]" : ""
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

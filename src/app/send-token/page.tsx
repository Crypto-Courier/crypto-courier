"use client";
import React, { useRef, useEffect, useState } from 'react';
import "../styles/History.css";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import token from "../assets/assets.png";
import Image from "next/image";
import { useTheme } from 'next-themes';
import profile from "../assets/profile.png";
import defaultTokenImage from "../assets/assets.png"; // Add this import
import { TokenConfig } from "../../config/tokenConfig";

interface LinkedAccount {
  type: string;
  address: string;
  verified_at: number;
  first_verified_at: number | null;
  latest_verified_at: number | null;
}
interface ApiResponse {
  id: string;
  created_at: number;
  linked_accounts: LinkedAccount[];
  mfa_methods: any[];
  has_accepted_terms: boolean;
  is_guest: boolean;
}

interface TokenWithBalance extends TokenConfig {
  balance: string;
  rawBalance: string;
}

interface NewToken {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
}

const SendToken = () => {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("ETH");
  const [tokenAmount, setTokenAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);
  const { theme } = useTheme();

  const popupRef = useRef(null); // Reference for the popup element

  const [newToken, setNewToken] = useState<NewToken>({
    contractAddress: "",
    symbol: "",
    name: "",
    decimals: 18,
  });

  useEffect(() => {
    if (address) {
      fetchTokens();
    }
  }, [address]);

  const fetchTokens = async () => {
    try {
      const response = await fetch(`/api/get-tokens?address=${address}`);
      const tokenData = await response.json();
      setTokens(tokenData);
      if (tokenData.length > 0) {
        setSelectedToken(tokenData[0].contractAddress);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value);
  };

  const handleSend = async () => {
    try {
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: recipientEmail }),
      });

      const data: ApiResponse = await response.json();
      console.log(data);

      const walletAccount = data.linked_accounts.find(
        (account: LinkedAccount) => account.type === "wallet"
      );
      if (walletAccount) {
        const walletAddress = walletAccount.address;
        setRecipientWalletAddress(walletAddress);
        console.log("Recipient's wallet address:", walletAddress);
      } else {
        console.log("No wallet address found in the response");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setNewToken({
          contractAddress: "",
          symbol: "",
          name: "",
          decimals: 18,
        });
        fetchTokens(); // Refresh the token list
      } else {
        console.error("Failed to add token");
      }
    } catch (error) {
      console.error("Error adding token:", error);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl mx-auto my-[140px]  shadow-lg">
          <div  className={`flex justify-between border-black border-b-0 p-[30px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}>
            <div className={`flex items-center space-x-3 p-2 rounded-[10px] ${theme==="dark "?" text-black-500 bg-[#1C1C1C]":"bg-[#F4F3F3]"}`}>
              <div className={`w-10 h-10 bg-gray-300 rounded-full `}>
                <Image src={profile} alt="" />
              </div>
              <span className="font-semibold text-[15px]">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "0x97C686c171a63cbDC3d7A7EbB952Cf0Fea831091"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <div>
                <div className="text-[18px] text-black-600 py-1 font-[500] text-start">
                  Your balance
                </div>
                <div className={`text-[25px] font-bold   py-1 px-3 rounded-[10px] ${theme==="dark" ? "text-[#FFE500] border border-[#A2A2A2] bg-[#1C1C1C]":"text-[#E265FF] border border-gray"}`}>
                  $2230.1044
                </div>
              </div>

              <button className={`  px-[30px] py-[10px] rounded-full mx-7 ${
              theme === "dark" ? "bg-[#FFE500] text-[#363535]" : "bg-[#E265FF] text-white" }`}>
                GIFT TOKEN
              </button>
            </div>
          </div>
          <div className="rounded-br-[40px] items-start rounded-bl-[40px] flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 py-[60px] px-[30px] justify-between bg-white/80 backdrop-blur-[50px]">
            <div className="w-full md:w-[55%] ">
              <div className="flex justify-between mx-5">
                {" "}
                <h3 className="text-[20px] font-medium  text-[#696969]">
                  All assets
                </h3>
                <button
                  onClick={() => setShowAddTokenForm(true)}
                  className="bg-[#E265FF] text-white px-4 py-2 rounded-full text-sm"
                >
                  Add Token
                </button>
              </div>

              <div className="h-[30vh] overflow-y-auto scroll">
  {tokens.length > 0 ? (
    tokens.map((token, index) => (
      <div
        key={index}
        className="flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 bg-[#FFFCFC] my-4 mx-4"
      >
        <div className="flex items-center space-x-2">
          <Image
            src={defaultTokenImage}
            alt={token.symbol || "Token"}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-black font-bold">{token.symbol}</span>
        </div>
        <div className="text-right">
          <div className="font-bold">{parseFloat(token.balance).toFixed(4)}</div>
          <div className="text-xs text-gray-600">{token.rawBalance}</div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center h-full">
    <span className="text-center text-gray-500">No tokens found</span>
  </div>
  )}
</div>

            </div>

            <div className="w-full md:w-[40%]">
              <div>
                <label className="block text-lg font-[500] text-black mb-1">
                  Enter token amount to send
                </label>
                <div className="flex space-x-2">
                  <div className="flex-grow bg-[#FFFCFC] bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ">
                    <input
                      type="text"
                      placeholder=" token amount "
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-800 "
                    />
                    <button className="text-sm border  border-gray text-[#FF336A] px-3 py-1">
                      Max
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-[#FFFCFC] bg-opacity-50 rounded-xl p-3 flex items-center space-x-1 ">
                      <select
                        value={selectedToken}
                        onChange={handleChange}
                        className="appearance-none font-medium bg-transparent focus:outline-none"
                      >
                        {tokens.map((token) => (
                          <option
                            key={token.contractAddress}
                            value={token.contractAddress}
                          >
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-[500] text-black mb-1 ">
                  Enter recipient's email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient's email address"
                  className="w-full bg-[#FFFCFC] bg-opacity-50 rounded-xl p-3 outline-none text-gray-800 "
                />
              </div>

              <div className="flex  pt-6 space-x-7">
                <button className="px-6 py-3 rounded-full border border-[#FF336A] text-[#FF336A] font-medium ">
                  CANCEL
                </button>
                <button
                  onClick={handleSend}
                  className="px-9 py-3 rounded-full border border-red-300 text-white font-medium bg-[#FF336A]"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        
        </div>
        <Footer />

        {showAddTokenForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg max-w-[40%] w-full relative">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowAddTokenForm(false)}
        className="absolute top-0 right-[1rem] text-gray-500 hover:text-gray-700 text-[25px]"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4 p-4 text-center border-b border-red-500">
        Add New Token
      </h2>
      <form onSubmit={handleAddToken} className="mx-7 my-2">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Address
          </label>
          <input
            type="text"
            value={newToken.contractAddress}
            onChange={(e) =>
              setNewToken({
                ...newToken,
                contractAddress: e.target.value,
              })
            }
            className="w-full bg-[#FFFCFC] bg-opacity-50 rounded-[7px] p-1 border border-gray-500 text-gray-800 focus-none"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symbol
          </label>
          <input
            type="text"
            value={newToken.symbol}
            onChange={(e) =>
              setNewToken({ ...newToken, symbol: e.target.value })
            }
            className="w-full bg-[#FFFCFC] bg-opacity-50 rounded-[7px] p-1 border border-gray-500 text-gray-800 focus-none"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={newToken.name}
            onChange={(e) =>
              setNewToken({ ...newToken, name: e.target.value })
            }
            className="w-full bg-[#FFFCFC] bg-opacity-50 rounded-[7px] p-1 border border-gray-500 text-gray-800 focus-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decimals
          </label>
          <input
            type="number"
            value={newToken.decimals}
            onChange={(e) =>
              setNewToken({
                ...newToken,
                decimals: parseInt(e.target.value),
              })
            }
            className="w-full bg-[#FFFCFC] bg-opacity-50 rounded-[7px] p-1 border border-gray-500 text-gray-800 focus-none"
            required
          />
        </div>
        <div className="flex justify-center space-x-2 mb-7 mt-7">
          <button
            type="button"
            onClick={() => setShowAddTokenForm(false)}
            className="px-4 py-2 border border-[#FF336A] text-[#FF336A] rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-red-300 text-white font-medium bg-[#FF336A] rounded-md shadow-sm text-sm font-medium"
          >
            Add Token
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default SendToken;

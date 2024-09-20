"use client";
import React, { useState } from "react";
import "../styles/History.css";
// import Wallet from "../components/Wallet";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import token from "../assets/assets.png";
import Image from "next/image";
import profile from "../assets/profile.png";

const SendToken = () => {
  const { address } = useAccount();
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [tokenAmount, setTokenAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");

  const assets = [
    { name: "ETH", balance: "0.05", value: "$92.54" },
    { name: "ETH", balance: "0.05", value: "$92.54" },
    { name: "ETH", balance: "0.05", value: "$92.54" },
    { name: "ETH", balance: "0.05", value: "$92.54" },
  ];

  const tokens = [
    { name: "ETH", color: "bg-blue-500" },
    { name: "DAI", color: "bg-yellow-500" },
    { name: "USDC", color: "bg-green-500" },
    { name: "WBTC", color: "bg-orange-500" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value);
  };

  const handleSend = async () => {
    try {
      const response = await fetch('/api/create-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recipientEmail }),
      });

      const data: ApiResponse = await response.json();
      console.log(data); // Log the full response from the API

      // Extract the wallet address from the response
      const walletAccount = data.linked_accounts.find(
        (account: LinkedAccount) => account.type === 'wallet'
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

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-7xl mx-auto my-[120px]  shadow-lg">
          <div className="flex justify-between border-black border-b-0 p-[40px] bg-white rounded-tl-[40px] rounded-tr-[40px] items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full">
                <Image src={profile} alt="" />
              </div>
              <span className="font-semibold text-[18px]">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "  0x97C686c171a63cbDC3d7A7EbB952Cf0Fea831091"}
              </span>
            </div>
            <div className="text-right flex items-center">
              <div>
                <div className="text-[18px] text-black-600 py-1 font-[500]">
                  Your balance
                </div>
                <div className="text-[25px] font-bold text-[#E265FF]">
                  $2230.1044
                </div>
              </div>
              <div>
                <button className="bg-[#E265FF] text-white px-[30px] py-[15px] rounded-full mx-7">
                  GIFT TOKEN
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-br-[40px] items-center rounded-bl-[40px] flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-[40px] justify-between bg-white/80 backdrop-blur-[50px]">
            <div className="w-full md:w-1/2">
              <h3 className="text-[20px] font-medium  text-[#696969]">
                all assets
              </h3>
              <div className="">
                {assets.map((asset, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center  bg-opacity-50 rounded-xl shadow-sm p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={token}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />

                      <span className="text-black font-bold">{asset.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{asset.balance}</div>
                      <div className="text-xs text-gray-600">{asset.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div>
                <label className="block text-lg font-bold text-black mb-1">
                  Enter token amount to send
                </label>
                <div className="flex space-x-2">
                  <div className="flex-grow bg-white rounded-xl p-3 mb-3 flex justify-between items-center shadow-md">
                    <input
                      type="text"
                      placeholder=" token amount "
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-800 "
                    />
                    <button className="text-sm text-gray-500 ">max</button>
                  </div>
                  <div className="relative">
                    <div className="bg-white rounded-xl p-3 flex items-center space-x-1 shadow-md">
                      <div
                        className={`${
                          tokens.find((t) => t.name === selectedToken)?.color
                        } rounded-full`}
                      ></div>
                      <select
                        value={selectedToken}
                        onChange={handleChange}
                        className="appearance-none font-medium bg-transparent focus:outline-none"
                      >
                        {tokens.map((token) => (
                          <option key={token.name} value={token.name}>
                            {token.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-black mb-1 ">
                  Enter recipient's email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient's email address"
                  className="w-full bg-white rounded-xl p-3 outline-none text-gray-800 shadow-md"
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
     
      </div>
      <Footer />
    </div>
  );
};

export default SendToken;

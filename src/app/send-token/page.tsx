"use client";
import React, { useState } from "react";
import "../styles/History.css";
// import Wallet from "../components/Wallet";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
// import img from "../assets/darkbg.png";
// import Image from "next/image";

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
    <div>
      {/* <div className="w-full h-full absolute z-20">
        <Image src={img} alt="" className="w-full h-full" />
      </div> */}
      <div className="main">
        <Navbar />
        <div className="txbg">
          <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <span className="font-semibold">
                  {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "Connect Wallet"}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  your overall balance
                </div>
                <div className="text-xl font-bold text-purple-600">
                  $2230.1044
                </div>
              </div>
            </div>

            <button className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm mb-6">
              GIFT TOKEN
            </button>

            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-3">all assets</h3>
                <div className="space-y-2">
                  {assets.map((asset, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <span>{asset.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{asset.balance}</div>
                        <div className="text-xs text-gray-600">
                          {asset.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    enter token amount to send
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-grow bg-white rounded-xl p-2 flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="enter token amount "
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-800"
                      />
                      <button className="text-sm text-gray-500">max</button>
                    </div>
                    <div className="relative">
                      <div className="bg-white rounded-xl p-2 flex items-center space-x-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    recipient's email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="enter recipient's email address"
                    className="w-full bg-white rounded-xl p-3 outline-none text-gray-800"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button className="px-6 py-2 rounded-full border border-red-300 text-red-500 font-medium">
                    CANCEL
                  </button>
                  <button
                    onClick={handleSend}
                    className="px-6 py-2 rounded-full border border-red-300 text-red-500 font-medium"
                  >
                    SEND
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* {recipientWalletAddress && (
            <div className="mt-4 text-sm text-gray-600">
              Recipient's wallet address: {recipientWalletAddress}
            </div>
          )} */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SendToken;

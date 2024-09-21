"use client";
import React, { useState, useEffect } from "react";
import "../styles/History.css";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import token from "../assets/assets.png";
import Image from "next/image";
import profile from "../assets/profile.png";
import defaultTokenImage from "../assets/assets.png"; // Add this import
import { TokenConfig } from '../../config/tokenConfig';

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
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);
  const [newToken, setNewToken] = useState<NewToken>({
    contractAddress: '',
    symbol: '',
    name: '',
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
      const response = await fetch('/api/create-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recipientEmail }),
      });

      const data: ApiResponse = await response.json();
      console.log(data);

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

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newToken),
      });

      if (response.ok) {
        setShowAddTokenForm(false);
        setNewToken({ contractAddress: '', symbol: '', name: '', decimals: 18 });
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[20px] font-medium text-[#696969]">
                  all tokens
                </h3>
                <button
                  onClick={() => setShowAddTokenForm(true)}
                  className="bg-[#E265FF] text-white px-4 py-2 rounded-full text-sm"
                >
                  Add Token
                </button>
              </div>
              <div className="">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center  bg-opacity-50 rounded-xl shadow-sm p-3"
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
                      <select
                        value={selectedToken}
                        onChange={handleChange}
                        className="appearance-none font-medium bg-transparent focus:outline-none"
                      >
                        {tokens.map((token) => (
                          <option key={token.contractAddress} value={token.contractAddress}>
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

      {showAddTokenForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Token</h2>
            <form onSubmit={handleAddToken}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contract Address</label>
                <input
                  type="text"
                  value={newToken.contractAddress}
                  onChange={(e) => setNewToken({...newToken, contractAddress: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Symbol</label>
                <input
                  type="text"
                  value={newToken.symbol}
                  onChange={(e) => setNewToken({...newToken, symbol: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newToken.name}
                  onChange={(e) => setNewToken({...newToken, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Decimals</label>
                <input
                  type="number"
                  value={newToken.decimals}
                  onChange={(e) => setNewToken({...newToken, decimals: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTokenForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendToken;

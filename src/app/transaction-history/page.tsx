"use client";
import react, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/History.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import Image from "next/image";
import trx from "../assets/trx.png";
import { sendEmail } from "../components/Email/Emailer";
import { renderEmailToString } from '../components/Email/renderEmailToString';

interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
}
interface Transaction {
  tokenAmount: string;
  tokenSymbol: string;
  customizedLink: string;
  recipientEmail: string;
}

const TxHistory: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  // const [error, setError] = useState(null);

  const { theme } = useTheme();

  const fetchTokenDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setTokenDetails(null);

    try {
      const res = await fetch("/api/getTokenDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenAddress }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setTokenDetails(data);
      } else {
        setError(data.message || "Error fetching token details");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const SendToken = () => {
    router.push("/send-token"); // Replace "/send" with the route you want to navigate to
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/get-transactions?senderWallet=${address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const handleResend = async (tx: Transaction) => {
    try {
      const subject = "Nothing to worry! Your Crypto token is in your inbox again 📩";
      const htmlContent = renderEmailToString({
        recipientEmail: tx.recipientEmail,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
      });

      await sendEmail({
        recipientEmail: tx.recipientEmail,
        subject,
        htmlContent,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
      });

      alert('Email resent successfully!');
     } catch (error) {
      console.error('Error resending email:', error);
      alert('Failed to resend email. Please try again.');
    }
  };

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-opacity-50 p-3 rounded-xl border border-gray-300"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-24 bg-gray-300 rounded-[10px]"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded-[10px]"></div>
          </div>
          <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="main">
      <Navbar />
      <div className="txbg ">
        <div className="max-w-6xl w-[90%] m-auto ">
          <div
            className={`flex justify-between border-black border-b-0 p-[30px] shadow-lg ${
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
              <div className="w-10 h-10 bg-gray-300 rounded-full hidden lg:flex md:flex sm:flex"></div>
              <span className="font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connect Wallet"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <div>
                {/* <div className="text-[18px] text-black-600 py-1 font-[500] text-start">
                  Your balance
                </div>
                <div
                  className={`text-[25px] font-bold py-1 px-3 rounded-[10px] ${
                    theme === "dark"
                      ? "text-[#FFE500] border border-[#A2A2A2] bg-[#1C1C1C]"
                      : "text-[#E265FF] border border-gray"
                  }`}
                >
                  $2230.1044
                </div> */}
              </div>
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
                onClick={SendToken}
              >
                GIFT TOKEN
              </button>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[50px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start py-[30px] px-[30px]`}
          >
            <div className="space-y-3 text-[12px] lg:text-[13px] md:text-[13px] sm:text-[13px]">
              <h3
                className={` font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] ${
                  theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
              >
                Transaction history
              </h3>
              {isLoading ? (
                <SkeletonLoader />
              ) : error ? (
                <p className="text-red-700">Error: {error}</p>
              ) : transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                transactions.map((tx, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center bg-opacity-50 p-3 rounded-xl ${
                      theme === "dark"
                        ? "bg-[#000000]/20 border border-[#5C5C5C]"
                        : "bg-[#FFFCFC]/20 border border-[#FFFFFF]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`rounded-[10px] ${
                          theme === "dark"
                            ? "border border-[#FE660A] text-[#FE660A] bg-[#181818] py-1 px-2"
                            : "border border-[#FE660A] text-[#FE660A] bg-white py-1 px-2"
                        }`}
                      >
                        {tx.tokenAmount} {tx.tokenSymbol}
                      </span>
                      <span className="">to</span>
                      <span
                        className={`rounded-[10px] ${
                          theme === "dark"
                            ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                            : "border border-[#E265FF] text-[#E265FF] bg-white py-1 px-2"
                        }`}
                      >
                        {tx.recipientEmail}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                        <button  onClick={() => handleResend(tx)} className="">Resend</button>
                      </div>
                      <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                        <Image src={trx} alt="" />
                        <button
                          onClick={() =>
                            openTransactionReciept(tx.customizedLink)
                          }
                        >
                          View Tx
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <div></div>
    </div>
  );
};
export default TxHistory;

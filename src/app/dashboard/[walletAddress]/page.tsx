"use client";
import react, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../styles/History.css";
import NewNavbar from "./newNavbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import Image from "next/image";
import trx from "../../assets/trx.png";
import { sendEmail } from "../../components/Email/Emailer";
import { renderEmailToString } from '../../components/Email/renderEmailToString';
import { usePrivy } from '@privy-io/react-auth';
import toast from "react-hot-toast";

interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
}
interface Transaction {
  senderWallet: string;
  recipientWallet: string;
  tokenAmount: string;
  tokenSymbol: string;
  customizedLink: string;
  recipientEmail: string;
}

const WalletAddressPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { ready, authenticated, user, exportWallet, logout } = usePrivy();
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");

  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  // const [error, setError] = useState(null);

  const { theme } = useTheme();

  const walletAddress = params?.walletAddress as string;

  const signOut = async () => {
    router.push("/");
  };

  // const isAuthenticated = ready && authenticated;
  // const hasEmbeddedWallet = user?.linkedAccounts?.find(
  //   (account) => account.type === 'wallet' && account.walletClient === 'privy'
  // );

  const canExportWallet = true;

  useEffect(() => {
    console.log("Privy state:", { ready, authenticated, user });
    console.log("Export wallet function:", exportWallet);
  }, [ready, authenticated, user, exportWallet]);

  const handleExportWallet = async () => {
    console.log("Export wallet button clicked");
    setExportStatus("Exporting wallet...");
    try {
      console.log("Calling exportWallet function...");
      await exportWallet();
      console.log('Wallet exported successfully');
      setExportStatus('Wallet exported successfully');
      toast.success('Wallet exported successfully.');
    } catch (error: unknown) {
      console.error("Error exporting wallet:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setExportStatus(`Export failed: ${errorMessage}`);
      toast.error("Failed to export wallet. Refresh page and try again.");
    }
  };

  // useEffect(() => {
  //   if (!user || user.wallet?.address !== walletAddress) {
  //     router.push('/');
  //   }
  // }, [user, walletAddress, router]);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/get-transactions?walletAddress=${walletAddress}`
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
  }, [walletAddress]);

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const handleResend = async (tx: Transaction) => {
    try {
      const subject =
        "Nothing to worry! Your Crypto token is in your inbox again 📩";
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

      alert("Email resent successfully!");
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Failed to resend email. Please try again.");
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
      <NewNavbar />
      <div className="txbg ">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px]">
          <div
            className={`flex justify-between border-black border-b-0 p-[30px] ${
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
                {walletAddress
                  ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}`
                  : "Connect Wallet"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <button
                onClick={handleExportWallet}
                className={`px-[30px] py-[10px] rounded-full mx-7 hover:scale-110 duration-500 transition 0.3 ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
              >
                Export Wallet {canExportWallet ? "" : "(Disabled)"}
              </button>
              {/* {exportStatus && (
                <div className="mt-2 text-sm">
                  {exportStatus}
                </div>
              )} */}
              <button
                className={`px-[30px] py-[10px] rounded-full mx-7 hover:scale-110 duration-500 transition 0.3 ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start py-[30px] px-[30px]`}
          >
            <div className="space-y-3">
              <h3
                className={`font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] ${
                  theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
              >
                Transaction history
              </h3>
              <div className="h-[40vh] overflow-y-auto scroll">
                {isLoading ? (
                  <SkeletonLoader />
                ) : error ? (
                  <div className="text-red-700 h-[40vh] flex justify-center items-center text-[20px]">
                    {error}
                  </div>
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
                        {tx.senderWallet === walletAddress ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            <span className="">from</span>
                            <span
                              className={`rounded-[10px] ${
                                theme === "dark"
                                  ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                                  : "border border-[#E265FF] text-[#E265FF] bg-white py-1 px-2"
                              }`}
                            >
                              {`${tx.senderWallet.slice(
                                0,
                                6
                              )}...${tx.senderWallet.slice(-4)}`}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {tx.senderWallet === walletAddress && (
                          <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                            <button
                              onClick={() => handleResend(tx)}
                              className=""
                            >
                              Resend
                            </button>
                          </div>
                        )}
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
      </div>
      <Footer />
      <div></div>
    </div>
  );
};
export default WalletAddressPage;

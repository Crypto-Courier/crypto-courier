import React, { useState } from "react";
import { X, Copy } from "lucide-react";
import wallet from "../assets/wallet.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import add from "../assets/wAdd.png";
import spin from "../assets/spinner.gif";
import trx2 from "../assets/trx2.png";

interface TxDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAmount: string;
  tokenSymbol: string;
  recipientEmail: string;
  onConfirm: (walletAddress: string) => void;
}

const TxDetails: React.FC<TxDetailsProps> = ({ 
  isOpen, 
  onClose, 
  tokenAmount, 
  tokenSymbol, 
  recipientEmail, 
  onConfirm 
}) => {
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleCreateWallet = async () => {
    try {
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: recipientEmail }),
      });

      const data = await response.json();
      const walletAccount = data.linked_accounts.find(
        (account: any) => account.type === "wallet"
      );

      if (walletAccount) {
        setWalletAddress(walletAccount.address);
        setIsWalletCreated(true);
      } else {
        console.log("No wallet address found in the response");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const handleConfirm = () => {
    onConfirm(walletAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-[10px] max-w-lg w-full mx-4 relative ${
          theme === "dark"
            ? "bg-[#111111] border-red-500 border backdrop-blur-[10px]"
            : "bg-[#FFFCFC] border border-[#FE005B]/60"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-[1rem] text-gray-500 hover:text-gray-700 text-[25px]"
        >
          <X size={24} />
        </button>

        <div
          className={`flex justify-center items-center p-6 rounded-tr-[10px] rounded-tl-[10px] ${
            theme === "dark"
              ? "bg-[#000000] border-b-2 border-red-500"
              : "bg-white border-b-2 border-[#FE005B]"
          }`}
        >
          <div className="flex items-center flex-col">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-2">
              {theme === "light" ? (
                <Image src={wallet} alt="wallet" />
              ) : (
                <Image src={trx2} alt="wallet" />
              )}
            </div>
            <h2
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {isWalletCreated ? "Transaction Details" : "Create Wallet"}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {!isWalletCreated ? (
            <div>
              <p className={`text-center mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                A new wallet will be created for {recipientEmail}
              </p>
              <button
                onClick={handleCreateWallet}
                className={`${
                  theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                } w-full text-white py-2 rounded-[10px] flex items-center justify-center mb-4`}
              >
                Create Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-5 mb-4 flex-col ">
             
                  
              
                {/* <p className={`text-md ${theme === "dark" ? "text-white" : "text-black"}`}>to</p> */}
                <p className={` text-md rounded-[12px] text-md py-2 px-4 ${theme === "dark" ? "text-[#FFE500]  bg-[#272626]" : "text-black"}`}>
                You will Send {tokenAmount} to {recipientEmail}
                </p>
                <p className={` text-md rounded-[12px] text-md py-2 px-4 ${theme === "dark" ? "text-[#FFE500]  bg-[#272626]" : "text-black"}`}>
                New Wallet for Recipient: {walletAddress}
                </p>
                <p>
                  You can check out transaction for surity.
                </p>
                {/* <Image src={spin} alt="Loading..." width={100}/> */}
              </div>
              
              <div className="flex gap-5">
                <button
                  onClick={onClose}
                  className={`${
                    theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                  } w-full text-white py-2 rounded-[10px] flex items-center justify-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`${
                    theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                  } w-full text-white py-2 rounded-[10px] flex items-center justify-center`}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TxDetails;
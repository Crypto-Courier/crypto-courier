import React from "react";
import { X, Copy } from "lucide-react";
import wallet from "../assets/wallet.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import add from "../assets/wAdd.png";
import add2 from "../assets/wadd2.png";
import trx2 from "../assets/trx2.png";
import { WalletProps } from "../types/types";
// Define the types for the component props

const Wallet: React.FC<WalletProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-[10px] max-w-md w-full mx-4 relative ${
          theme === "dark"
            ? "bg-[#000000] border-red-500 border backdrop-blur-[10px]"
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
              ? "bg-[#171717] border-b-2 border-red-500"
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
              Transfer Wallet
            </h2>
            <div
              className={`flex justify-center gap-3 rounded-[10px] py-1 px-2 item-center mt-[10px] ${
                theme === "dark"
                  ? "text-[#FE660A] border border-[#FE660A] bg-[#FE005B]/6 bg-opacity-50 backdrop-blur-[80px] w-full"
                  : "text-[#FF005C] border border-[#FF005C] bg-[#FE005B]/6 bg-opacity-50 backdrop-blur-[80px] w-full"
              }`}
            >
              {theme === "light" ? (
                <Image src={add} alt="wallet address" />
              ) : (
                <Image src={add2} alt="wallet address" />
              )}
              <div>nndedh78</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-[15px] mb-4 text-center font-semibold">
            You can bring your account with you to another site using an
            external wallet.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#E265FF] p-2 rounded-[10px] flex items-center justify-center mr-2 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <p
                className={`text-sm w-full ${
                  theme === "dark"
                    ? "border border-[#A2A2A2] bg-[#151515] py-2 px-2 rounded-[10px]"
                    : "border border-gray bg-white py-1 px-2 rounded-[10px]"
                }`}
              >
                Click "Copy Key" below to copy your account key to your
                clipboard.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#E265FF] p-2 rounded-[10px] flex items-center justify-center mr-2 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <p
                className={`text-sm w-full ${
                  theme === "dark"
                    ? "border border-[#A2A2A2] bg-[#151515] py-2 px-2 rounded-[10px]"
                    : "border border-gray bg-white py-1 px-2 rounded-[10px]"
                }`}
              >
                Copy the key into your wallet.
              </p>
            </div>
          </div>

          <button
            className={`${
              theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
            } w-full text-white py-2 rounded-[10px] flex items-center justify-center mb-4`}
          >
            <Copy size={18} className="mr-2" />
            Go to Dashboard page
          </button>

          <div
            className={`border border-red-300 rounded-lg p-3 ${
              theme === "dark"
                ? "bg-[#FF3333]/6 bg-opacity-50 backdrop-blur-[10px] text-[#FF3333]"
                : ""
            }`}
          >
            <p className="text-sm text-red-700">
              Warning:
              <br />
              Never share your private key or recovery phrase with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

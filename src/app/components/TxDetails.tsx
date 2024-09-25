import React from "react";
import { X, Copy } from "lucide-react";
import wallet from "../assets/wallet.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import add from "../assets/wAdd.png";
import add2 from "../assets/wadd2.png";
import trx2 from "../assets/trx2.png";

// Define the types for the component props
interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const TxDetails: React.FC<WalletProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-[10px] max-w-lg w-full mx-4 relative ${
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
              Transaction Details
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-5">
            <p className={`text-xl `}>Sending 0.000002</p>
            <p
              className={`text-xl 
                  `}
            >
              to
            </p>
            <p
              className={`text-xl
                `}
            >
              user@gmail.com
            </p>
          </div>{" "}
          <div className="flex gap-5 mt-5">
            <button
              onClick={onClose}
              className={`${
                theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
              } w-full text-white py-2 rounded-[10px] flex items-center justify-center mb-4`}
            >
              Cancel
            </button>
            <button
              className={`${
                theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
              } w-full text-white py-2 rounded-[10px] flex items-center justify-center mb-4`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxDetails;

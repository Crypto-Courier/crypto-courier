"use client";
import react ,{useState}from "react";
import { useRouter } from "next/navigation";
import "../styles/History.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import Image from "next/image";
import trx from "../assets/trx.png";
import Wallet from "../components/Wallet";

const TxHistory = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { theme } = useTheme();

  const SendToken = () => {
    router.push("/send-token"); // Replace "/send" with the route you want to navigate to
  };
  const transactions = [
    { amount: "1$ Design", recipient: "example@email.com" },
    { amount: "10$ Design", recipient: "example@email.com" },
    { amount: "1.5$ Design", recipient: "example@email.com" },
    { amount: "5$ Design", recipient: "example@email.com" },
  ];

  return (
    <div className="main">
      <Navbar />
      <div className="txbg ">
        <div className="max-w-6xl mx-auto my-[140px]  shadow-lg">
          <div
            className={`flex justify-between border-black border-b-0 p-[30px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            {" "}
            <div
              className={`flex items-center space-x-3 p-2 rounded-[10px] ${
                theme === "dark"
                  ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                  : "bg-[#F4F3F3] border border-[#C6C6C6]"
              }`}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <span className="font-semibold">
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
                <div
                  className={`text-[25px] font-bold   py-1 px-3 rounded-[10px] ${
                    theme === "dark"
                      ? "text-[#FFE500] border border-[#A2A2A2] bg-[#1C1C1C]"
                      : "text-[#E265FF] border border-gray"
                  }`}
                >
                  $2230.1044
                </div>
              </div>

              <button
                className={`  px-[30px] py-[10px] rounded-full mx-7 ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
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
            } rounded-br-[40px] rounded-bl-[40px]  md:flex-row space-y-6 md:space-y-0 md:space-x-6 py-[50px] px-[30px] justify-between items-start`}
          >
            <div className="space-y-3">
              <h3
                className={`text-[20px] font-medium   ${
                  theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
              >
                {" "}
                Transaction history
              </h3>
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center  bg-opacity-50 p-3 rounded-xl ${theme==="dark"?"]bg-[#000000]/20 border border-[#5C5C5C]":"bg-[#FFFCFC]/20 border border-[#FFFFFF]"}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={` rounded-[10px] ${theme==="dark"?"border border-[#FE660A] text-[#FE660A]  bg-[#181818] py-1 px-2 ":"border border-[#FE660A] text-[#FE660A]  bg-white py-1 px-2 "}`}>{tx.amount}</span>
                    <span className="">to</span>
                    <span  className={` rounded-[10px] ${theme==="dark"?"border border-[#E265FF] text-[#E265FF]  bg-[#181818] py-1 px-2 ":"border border-[#E265FF] text-[#E265FF]  bg-white py-1 px-2 "}`}>
                      {tx.recipient}
                    </span>
                  </div>
                  <div className="bg-[#FF336A] text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                  <Image src={trx} alt=""/>
                  <button                   onClick={() => setIsPopupOpen(true)}
                  >
                    View Tx
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Wallet isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      </div>
      <Footer />
    </div>
  );
};
export default TxHistory;

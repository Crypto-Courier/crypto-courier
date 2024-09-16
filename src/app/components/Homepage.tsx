import React from "react";
import Navbar from "./Navbar";
import Image from "next/image";
import TokenCircles from "../assets/token.png";
import send from "../assets/send.png";

function Homepage() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center ">
        <div className="border border-t-1 border-b-1 border-l-0 border-r-0  w-full ">
          <div className="flex items-center justify-between w-[90%] m-auto">
            <div className="text-[7em] font-boldml-4 border-r-2 rounded-r-[100px] pr-[80px] pt-4 pb-4">
              Send your tokens
            </div>

            {/* Image of circles */}
            <div className="">
              <Image src={TokenCircles} alt="Token circles" />
            </div>
          </div>
        </div>
      </div>
      <div className=" p-4 flex items-center  text-[7em] w-[90%] m-auto text-center justify-center">
        <span>Tron</span>
        <div className="">
          <Image src={send} alt="send email" />
        </div>
        <span>email to anyone</span>
      </div>
    </div>
  );
}

export default Homepage;

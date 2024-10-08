import Footer from "../components/Footer";
import Homepage from "../components/Homepage";
import Image from "next/image";
import img from "../assets/darkbg.png";

export default function Home() {
  return (
    <div>
      {/* <div className="w-full h-full absolute z-20">
        <Image src={img} alt="" className="w-full h-full" />
      </div> */}
      <div className="">
        {/* This message will only appear on mobile screens */}
        <Homepage />

        {/* Hide the homepage on mobile screens */}
      </div>
    </div>
  );
}

import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import SendToken from "./components/SendToken";
import TxHistory from "./components/TxHistory";

export default function Home() {
  return (
    <div className="main">
      <Navbar/>
      {/* <Homepage /> */}
      {/* <TxHistory/> */}
      <SendToken/>
      <Footer/>
    </div>
  );
}

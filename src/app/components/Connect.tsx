"use client";
import "../styles/Connect.css";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";

const WalletButtons = () => {
  const { connected } = useWallet();

  return (
    <div>
      <WalletActionButton />
    </div>
  );
};
export default WalletButtons;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { ethers } from "ethers"; // Ensure ethers is imported for wallet connection

export const Connect = () => {
  const { ready, authenticated, login, user, logout } = usePrivy();
  const { setActiveWallet } = useSetActiveWallet(); // Destructure setActiveWallet from the hook
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Automatically connect to wallet if authenticated
    if (authenticated && user) {
      handleWalletConnection(); // Connect wallet if user is authenticated
    }
  }, [authenticated, user]);

  const handleWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        const [address] = await provider.send("eth_requestAccounts", []);
        await setActiveWallet({ address }); // Set the active wallet using Privy
        setWalletAddress(address); // Store the connected wallet address
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("Ethereum provider not found. Install MetaMask.");
    }
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const isConnected =
          mounted &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <>
            {!isConnected && (
              <>
                {/* Privy Login Button */}
                {!authenticated || !user ? (
                  <button onClick={login} className="ml-2">
                    Login with Privy
                  </button>
                ) : (
                  <div>Hello, {user.email ? user.email.address : "User"}</div>
                )}
                <button onClick={logout}>Log out</button>
              </>
            )}
            {isConnected && chain.unsupported && <button>Wrong network</button>}
            {isConnected && !chain.unsupported && (
              <>
                {chain.hasIcon && chain.iconUrl && (
                  <img
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    style={{ width: 20, height: 20 }}
                  />
                )}
                <span>{chain.name}</span>
                <span>{account.displayName}</span>

                {/* Show wallet address */}
                {account.displayBalance && (
                  <span> ({account.displayBalance})</span>
                )}
                {/* Sign Out Button */}
                <button
                  onClick={async () => {
                    await logout(); // Logout from Privy
                    setWalletAddress(null); // Clear wallet address on logout
                  }}
                  className="ml-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

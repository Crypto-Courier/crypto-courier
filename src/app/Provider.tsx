"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui";
import {
  TronLinkAdapter,
  BitKeepAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
} from "@tronweb3/tronwallet-adapters";

import "@tronweb3/tronwallet-adapter-react-ui/style.css";

const adapters = [
  new TronLinkAdapter(),
  new BitKeepAdapter(),
  new OkxWalletAdapter(),
  new TokenPocketAdapter(),
];

// Create a context for chainId
type ChainIdContextType = string | null;
const ChainIdContext = createContext<ChainIdContextType>(null);

export function useChainId(): ChainIdContextType {
  return useContext(ChainIdContext);
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <WalletProvider adapters={adapters} autoConnect={true}>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}

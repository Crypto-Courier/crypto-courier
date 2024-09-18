import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { bitTorrent, sepolia } from "wagmi/chains";

const myCustomChain: Chain = {
  id: 1029, 
  name: 'BitTorrent Chain Donau',
  nativeCurrency: {
    decimals: 18,
    name: 'BTT',
    symbol: 'BTT',
  },
  rpcUrls: {
    public: { http: ['https://pre-rpc.bt.io/'] },
    default: { http: ['https://pre-rpc.bt.io/'] },
  },
  blockExplorers: {
    default: { name: 'BTT Scan', url: 'https://testscan.bt.io' },
  },
}

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "f8a6524307e28135845a9fe5811fcaa2",
  chains: [sepolia, bitTorrent, myCustomChain],
  ssr: true,
});

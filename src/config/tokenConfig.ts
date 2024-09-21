export interface TokenConfig {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const tokens: TokenConfig[] = [{
    contractAddress: '0x0000000000000000000000000000000000001010',
    symbol: 'BTT',
    name: 'BitTorrent',
    decimals: 18,
  },
  {
  "contractAddress": "0xd1950e4dF2D837a2A1B11381957b6153A10DE595",
  "symbol": "WETH",
  "name": "Wrapped Ether",
  "decimals": 18
}];
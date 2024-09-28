export interface NewToken {
    contractAddress: string;
    name: string;
    symbol: string;
    decimals: number;
}

export interface TokenConfig {
    contractAddress: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface LinkedAccount {
    type: string;
    address: string;
    verified_at: number;
    first_verified_at: number | null;
    latest_verified_at: number | null;
}

export interface TokenWithBalance extends TokenConfig {
    balance: string;
    rawBalance: string;
}
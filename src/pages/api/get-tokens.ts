import { NextApiRequest, NextApiResponse } from 'next';
import { tokens } from '../../config/tokenConfig';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const apiKey = process.env.BTTC_API_KEY;

  try {
    const tokenPromises = tokens.map(token =>
      fetch(`https://api-testnet.bttcscan.com/api?module=account&action=tokenbalance&contractaddress=${token.contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`)
        .then(response => response.json())
    );

    const tokenResults = await Promise.all(tokenPromises);

    const tokenBalances = tokenResults.map((result, index) => {
      const rawBalance = result.result;
      const formattedBalance = ethers.formatUnits(rawBalance, tokens[index].decimals);
      return {
        ...tokens[index],
        balance: formattedBalance,
        rawBalance: rawBalance
      };
    });

    return res.status(200).json(tokenBalances);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newToken = req.body;

      if (!newToken.contractAddress || !newToken.symbol || !newToken.name || typeof newToken.decimals !== 'number') {
        return res.status(400).json({ error: 'Invalid token data' });
      }

      const client = await clientPromise;
      const db = client.db('tokenDatabase');

      const result = await db.collection('tokens').insertOne(newToken);

      res.status(200).json({ message: 'Token added successfully', result });
    } catch (error) {
      console.error('Error adding token:', error);
      res.status(500).json({ error: 'Failed to add token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

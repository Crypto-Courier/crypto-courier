import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newToken = req.body;
      const configPath = path.join(process.cwd(), 'src', 'config', 'tokenConfig.ts');
      
      // Read the current content of the file
      let content = fs.readFileSync(configPath, 'utf8');
      
      // Parse the existing tokens array
      const tokensMatch = content.match(/export const tokens: TokenConfig\[] = \[([\s\S]*?)\];/);
      if (!tokensMatch) {
        throw new Error('Unable to find tokens array in config file');
      }
      
      const existingTokens = tokensMatch[1].trim();
      
      // Add the new token to the array
      const updatedTokens = existingTokens ? 
        `${existingTokens},\n  ${JSON.stringify(newToken, null, 2)}` :
        `\n  ${JSON.stringify(newToken, null, 2)}\n`;
      
      // Replace the tokens array in the file content
      const updatedContent = content.replace(
        /export const tokens: TokenConfig\[] = \[([\s\S]*?)\];/,
        `export const tokens: TokenConfig[] = [${updatedTokens}];`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(configPath, updatedContent, 'utf8');
      
      res.status(200).json({ message: 'Token added successfully' });
    } catch (error) {
      console.error('Error adding token:', error);
      res.status(500).json({ error: 'Failed to add token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
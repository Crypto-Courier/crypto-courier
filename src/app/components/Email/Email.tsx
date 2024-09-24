import React from 'react';

interface EmailProps {
  recipientEmail: string;
  tokenAmount: string;
  tokenSymbol: string;
  txnHash: string;
}

const Email = ({ recipientEmail, tokenAmount, tokenSymbol, txnHash }: EmailProps) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0072C6; margin-bottom: 20px;">Transaction Confirmation</h1>
      <p style="font-size: 16px; margin-bottom: 10px;">Dear ${recipientEmail},</p>
      <p style="font-size: 16px; margin-bottom: 10px;">We are pleased to inform you that you have received a new transaction.</p>
      <div style="background-color: #F4F4F4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <p style="font-size: 16px; margin-bottom: 10px;">Amount: <strong>${tokenAmount} ${tokenSymbol}</strong></p>
        <p style="font-size: 16px; margin-bottom: 10px;">Transaction Hash: <a href="https://example.com/tx/${txnHash}" style="color: #0072C6;">${txnHash}</a></p>
      </div>
      <p style="font-size: 16px; margin-bottom: 10px;">Thank you for using our service!</p>
      <p style="font-size: 16px; margin-bottom: 10px;">Best regards,</p>
      <p style="font-size: 16px; margin-bottom: 10px;">Crypto Courier</p>
    </div>
  `;

  return emailContent;
};

export default Email;
interface EmailProps {
  recipientEmail: string;
  tokenAmount: string;
  tokenSymbol: string;
  txnHash: string;
}

const Email = ({ recipientEmail, tokenAmount, tokenSymbol, txnHash }: EmailProps) => {
  const emailContent = `
    <div>
      <h1>Transaction Confirmation</h1>
      <p>Hello,</p>
      <p>You have received a new transaction.</p>
      <p>Amount: ${tokenAmount} ${tokenSymbol}</p>
      <p>Transaction Hash: ${txnHash}</p>
      <p>Thank you for using our service!</p>
    </div>
  `;

  return emailContent;
};

export default Email;

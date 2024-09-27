import React from "react";
import Image from "next/image";
import Logo from "../../assets/lLogo.png";

interface EmailProps {
  recipientEmail: string;
  tokenAmount: string;
  tokenSymbol: string;
}
const Email: React.FC<EmailProps> = ({
  recipientEmail,
  tokenAmount,
  tokenSymbol,
}) => {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "10px", // Reduced padding
      }}
    >
      <div
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px", // Reduced padding
          marginBottom: "4px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
          CryptoCourier
        </div>
        <p style={{ fontSize: "15px", color: "white" }}>
          Take your first step into the world of Onchain journey.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <span style={{ fontSize: "16px", marginRight: "8px" }}>Hey 👋</span>
        <span style={{ fontSize: "16px" }}>
          You just received
          <strong>
            {tokenAmount} {tokenSymbol}
          </strong>
          Token
        </span>
      </div>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "6px", // Adjusted padding
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "6px", // Adjusted margin
          marginTop: "20px",
        }}
      >
        <p style={{ fontSize: "16px", color: "#4b5563" }}>
          "Welcome to the crypto space, <br />
          Enjoy the {tokenSymbol} Token"
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "16px" }}>
          Click the below link to Claim your tokens.
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="http://localhost:3000/claim-token"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "8px 12px", // Adjusted button size
            borderRadius: "6px", // Adjusted border radius
            fontSize: "16px", // Adjusted font size
            border: "1px solid black",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Claim Tokens 🎊🎉
        </a>
      </div>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "8px", // Reduced padding
          marginTop: "12px", // Reduced margin
          textAlign: "center",
          color: "#6b7280",
          fontSize: "12px", // Reduced font size
        }}
      >
        <p>&copy; 2024 CryptoCourier || All rights reserved.</p>
      </div>
    </div>
  );
};
export default Email;

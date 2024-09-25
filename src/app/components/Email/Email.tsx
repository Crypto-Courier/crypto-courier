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
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "14px",
          marginBottom: "4px",
          textAlign: "center",
        }}
      >
        <Image src={Logo} alt="CryptoCourier Logo" />

        <p style={{ fontSize: "20px", color: "white" }}>
          Take your first step into the world of Onchain journey.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <p style={{ fontSize: "18px", marginBottom: "2px" }}>Hey 👋</p>
        <p style={{ fontSize: "18px" }}>
          You just received {tokenAmount} {tokenSymbol} Token
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "4px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "2px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#4b5563" }}>
          "Welcome to the crypto space,
          <br />
          Enjoy the {tokenSymbol} Token"
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "2px" }}>
        <p style={{ fontSize: "18px" }}>
          Click the below link to Claim your tokens.
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="#"
          style={{
            backgroundColor: "#FFE500",
            color: "black",
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "18px",
            border: "1px solid black",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Claim Tokens
        </a>
      </div>
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "10px",
          marginTop: "20px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        <p>&copy; 2024 CryptoCourier || All rights reserved.</p>
      </div>
    </div>
  );
};

export default Email;

import axios from "axios";
import { renderEmailToString } from './renderEmailToString';

interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  tokenAmount: string;
  tokenSymbol: string;
}

export const sendEmail = async ({ recipientEmail, subject, htmlContent, tokenAmount, tokenSymbol }: SendEmailParams) => {
  try {

    const htmlContent = renderEmailToString({ recipientEmail, tokenAmount, tokenSymbol });
    
    const response = await axios.post("/api/send-email", {
      recipientEmail,
      subject,
      htmlContent,
    });

    if (response.status === 200) {
      console.log("Email sent successfully");
    } else {
      console.error("Error sending email:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

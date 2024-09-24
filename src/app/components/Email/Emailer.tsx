import axios from "axios";

interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
}

export const sendEmail = async ({ recipientEmail, subject, htmlContent }: SendEmailParams) => {
  try {
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

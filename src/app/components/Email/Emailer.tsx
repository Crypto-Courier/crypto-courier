import axios from 'axios';
import { renderEmailToString } from './renderEmailToString';

interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  tokenAmount: string;
  tokenSymbol: string;
}

export const sendEmail = async ({
  recipientEmail,
  subject,
  tokenAmount,
  tokenSymbol,
}: SendEmailParams): Promise<void> => {
  try {
    const htmlContent = renderEmailToString({ recipientEmail, tokenAmount, tokenSymbol });
    
    const response = await axios.post<{ message: string }>('/api/send-email', {
      recipientEmail,
      subject,
      htmlContent,
    });

    if (response.status === 200) {
      console.log('Email sent successfully');
    } else {
      console.error('Error sending email:', response.data.message);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
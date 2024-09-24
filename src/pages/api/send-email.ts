import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
    if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { recipientEmail, subject, htmlContent } = req.body;

  if (!recipientEmail || !subject || !htmlContent) {
    return res.status(400).json({ message: "Missing required fields" });
  }

    const { data, error } = await resend.emails.send({
        from: 'Crypto <onboarding@resend.dev>',
        to: [ recipientEmail ],
        subject: subject,
        html: htmlContent,
      });

      if (error) {
        return res.status(400).json(error);
      }
    
      res.status(200).json(data);
    
}

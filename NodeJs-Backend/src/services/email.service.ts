import nodemailer from "nodemailer";

const EmailService = {
  sendEmail: async (email: string, subject: string, html: string) => {
    try {
      const transporter = nodemailer.createTransport({
        port: process.env.EMAIL_PORT as unknown as number,
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        secure: true,
      });

      await transporter.verify();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: typeof email === "string" ? email.toLowerCase().trim() : email,
        subject: subject,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      return info;
    } catch (err) {
      console.log("Error sending email");
      console.error(err);
      return null;
    }
  },
};

export default EmailService;

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.AUTH,
  },
});

export const sendWelcomeEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  };

  //hello

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Eroor encountered while sending email");
  }
};

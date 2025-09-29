import nodemailer from "nodemailer";

const sendMailer = async (to, subject, html) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: `PetzAdop App <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
export default sendMailer;

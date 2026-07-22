require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ to, subject, html, text }) => {
    const { data, error } = await resend.emails.send({
      from: "BarberBook <onboarding@resend.dev>",
      to,
      subject,
      html: html || `<p>${text}</p>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};

module.exports = transporter;
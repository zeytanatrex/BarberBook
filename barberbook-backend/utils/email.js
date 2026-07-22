require("dotenv").config();

const brevo = require("@getbrevo/brevo");

const client = new brevo.BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const transporter = {
  sendMail: async ({ to, subject, html, text }) => {
    const destinatario =
      typeof to === "string"
        ? [{ email: to }]
        : to.map((email) => ({ email }));

    return client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "BarberBook",
        email: "barberbookproyecto@gmail.com",
      },
      to: destinatario,
      subject,
      htmlContent: html || `<p>${text || ""}</p>`,
    });
  },
};

module.exports = transporter;
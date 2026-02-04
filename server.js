const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const twilio = require("twilio");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // static files

// ENV
const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  ADMIN_EMAIL,
  PORT
} = process.env;

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Twilio Client (optional)
let client = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

// Helpers
function normalizeGermanPhone(input) {
  if (!input) return null;
  const raw = String(input).trim().replace(/\s+/g, "");

  if (raw.startsWith("+49")) return raw;
  if (raw.startsWith("0049")) return "+49" + raw.slice(4);
  if (raw.startsWith("0")) return "+49" + raw.slice(1);
  if (/^\d+$/.test(raw)) return "+49" + raw;
  return null;
}

function safeText(v) {
  return String(v || "").replace(/[<>]/g, "");
}

// Route
app.post("/book-appointment", async (req, res) => {
  const { name, email, phone, date, service, notes } = req.body || {};

  if (!name || !email || !phone || !date || !service) {
    return res.status(400).json({
      success: false,
      message: "Pflichtfelder fehlen (name, email, phone, date, service)."
    });
  }

  const toEmail = ADMIN_EMAIL || EMAIL_USER || "info.klarblickservice@gmail.com";
  const normalizedPhone = normalizeGermanPhone(phone);

  const mailOptions = {
    from: EMAIL_USER || "info.klarblickservice@gmail.com",
    to: toEmail,
    subject: `Neue Terminbuchung von ${safeText(name)}`,
    html: `
      <h2>Neue Buchungsanfrage</h2>
      <p><strong>Name:</strong> ${safeText(name)}</p>
      <p><strong>Email:</strong> ${safeText(email)}</p>
      <p><strong>Telefon:</strong> ${safeText(phone)}</p>
      <p><strong>Datum:</strong> ${safeText(date)}</p>
      <p><strong>Service:</strong> ${safeText(service)}</p>
      <p><strong>Anmerkungen:</strong> ${safeText(notes || "Keine")}</p>
    `
  };

  const smsMessage =
    `Neue Buchung: ${safeText(name)} | ${safeText(date)} | ${safeText(service)} | Tel: ${safeText(phone)}`;

  try {
    // Email
    if (EMAIL_USER && EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("Email nicht gesendet: EMAIL_USER/EMAIL_PASSWORD fehlen.");
    }

    // SMS optional
    if (client && TWILIO_PHONE_NUMBER && normalizedPhone) {
      await client.messages.create({
        body: smsMessage,
        from: TWILIO_PHONE_NUMBER,
        to: normalizedPhone
      });
    } else {
      console.warn("SMS nicht gesendet: Twilio nicht konfiguriert oder Telefon ungültig.");
    }

    res.json({ success: true, message: "Termin erfolgreich gebucht!" });
  } catch (error) {
    console.error("Fehler /book-appointment:", error);
    res.status(500).json({ success: false, message: "Fehler beim Buchen." });
  }
});

// Start
const port = Number(PORT) || 3000;
app.listen(port, () => console.log(`Server läuft auf Port ${port}`));

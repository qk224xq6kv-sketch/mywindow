const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('.'));

// Email Konfiguration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.klarblickservice@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio Konfiguration für SMS
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/book-appointment', async (req, res) => {
  const { name, email, phone, date, service, notes } = req.body;

  // Email an dich
  const mailOptions = {
    from: 'info.klarblickservice@gmail.com',
    to: 'info.klarblickservice@gmail.com',
    subject: `Neue Terminbuchung von ${name}`,
    html: `
      <h2>Neue Buchungsanfrage</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Datum:</strong> ${date}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Anmerkungen:</strong> ${notes || 'Keine'}</p>
    `
  };

  // SMS-Text
  const smsMessage = `Neue Buchung von ${name}. Datum: ${date}. Service: ${service}. Kontakt: ${phone}`;

  try {
    // Email senden
    await transporter.sendMail(mailOptions);

    // SMS senden
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+49' + phone.replace(/^0/, '')
    });

    res.json({ success: true, message: 'Termin erfolgreich gebucht!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Fehler beim Buchen.' });
  }
});

app.listen(3000, () => console.log('Server läuft auf Port 3000'));

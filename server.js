const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })
    .then((message) => {
      res.status(200).send({ success: true, message: message.sid });
    })
    .catch((error) => {
      res.status(500).send({ success: false, error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

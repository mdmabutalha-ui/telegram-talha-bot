import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

// Webhook endpoint
app.post(`/bot${process.env.TELEGRAM_TOKEN}`, async (req, res) => {
  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const userMessage = update.message.text;

    try {
      const response = await fetch('https://gemini-api.example.com/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMessage })
      });

      const data = await response.json();
      bot.sendMessage(chatId, data.response || "Talha AI could not answer.");
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "Error connecting to Talha AI.");
    }
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => res.send("Talha AI Bot is live!"));

app.listen(3000, () => console.log('Server running on port 3000'));

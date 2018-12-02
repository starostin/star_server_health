require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const Homeassistant = require('node-homeassistant');
const constants = require('./constants');

const app = express();
const port = 4422;
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const maxReconnectRetries = 3;
let reconnectRetries = 0;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);

const ha = new Homeassistant({
  host: 'star-asusrouter.asuscomm.com',
  protocol: 'wss', // "ws" (default) or "wss" for SSL
  retryTimeout: 20000, // in ms, default is 5000
  retryCount: -1, // default is 10, values < 0 mean unlimited
  password: process.env.API_PASSWORD,
  port: ''
});

ha.connect();

ha.on('connection', (info) => {
  switch (info) {
    case constants.CLOSED_CONNECTION:
      reconnectRetries += 1;

      if (reconnectRetries === maxReconnectRetries) {
        bot.sendMessage(chatId, 'Home Assistant  disconnected');
      }

      break;
    case constants.CONNECTED:
      reconnectRetries = 0;
      bot.sendMessage(chatId, 'Home Assistant  connected');
      break;
    default:
      break;
  }
});

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.listen(process.env.PORT || port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
  return true;
});

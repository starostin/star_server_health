const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const conf = require('dotenv').config();
const WebSocket = require('ws');

const app = express();
const port = 4422;

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
// const Homeassistant = require('node-homeassistant');
//
// let ha = new Homeassistant({
//   host: 'star-asusrouter.asuscomm.com',
//   protocol: 'wss', // "ws" (default) or "wss" for SSL
//   retryTimeout: 1000, // in ms, default is 5000
//   retryCount: 3, // default is 10, values < 0 mean unlimited
//   password: 'welcome',
//   port: ''
// });
//
// ha.connect().then(() => {
//   console.log('-----------------12----------')
// });
//
// ha.on('connection', info => {
//   console.log('connection state is', info)
// })

const ws = new WebSocket("wss://star-asusrouter.asuscomm.com/api/websocket");

// Functions to handle authentication with Home Assistant
// Implement yourself :)
// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

// async function connect() {
//   let auth;
//   try {
//     const hassUrl = 'https://star-asusrouter.asuscomm.com';
//     // Try to pick up authentication after user logs in
//     auth = await haJsWebsockets.getAuth({ hassUrl });
//   } catch (err) {
//     console.log('-----------err----------', err)
//   }
//   const connection = await haJsWebsockets.createConnection({ auth });
//   haJsWebsockets.subscribeEntities(connection, ent => console.log(ent));
// }

ws.on('open', function open() {
  bot.sendMessage(chatId, 'WS OPEN');
});

ws.on('message', function incoming(data) {
  bot.sendMessage(chatId, 'WS MESSAGE');
});

app.get('/', (request, response) => {
  bot.sendMessage(chatId, 'Hi from server');
  response.send('Hello from Express!');
});

app.listen(process.env.PORT || port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});

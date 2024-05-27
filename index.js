const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "6646988135:AAHE7_N4Gm_8PLNPGDpPes53qc3q0FensdA"; // BOT token
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
const port = process.env.PORT || 5000;

// Game short names and URLs
const games = {
    evmtele: "t.me/evmtele_bot/KakarotEVM",
    evmtele2: "t.me/evmtele_bot/DemoItch"
};

server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.send('Hello, welcome to the Telegram game bot server.');
    console.log("Root route accessed");
});

// List available games
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const response = "Say /start to choose a game.";
    bot.sendMessage(chatId, response)
        .then(() => console.log("Help message sent"))
        .catch(err => console.error("Error sending help message:", err));
});

// Handle the /start command to show a list of games with inline buttons
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "First Game (evmtele)", url: games['evmtele'] },
                    { text: "Second Game (evmtele2)", url: games['evmtele2'] }
                ]
            ]
        }
    };
    bot.sendMessage(chatId, "Choose a game to play:", options)
        .then(() => console.log("Start message sent with inline buttons"))
        .catch(err => console.error("Error sending start message:", err));
});

// Error handling for polling errors
bot.on("polling_error", (err) => {
    console.error("Polling error:", err);
    if (err.code === 'ETELEGRAM' && err.response && err.response.body) {
        console.error("Telegram API error:", err.response.body);
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

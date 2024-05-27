const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "6646988135:AAHE7_N4Gm_8PLNPGDpPes53qc3q0FensdA";
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
const port = process.env.PORT || 5000;

// Define your game short names, URLs, and local image paths
const games = {
    evmtele: {
        url: "https://saintdevelopergames.github.io/FlappyBird/",
        thumb_path: "/images/flappy.jpg"  // Ensure the file exists at public/images/flappy.jpg
    },
    evmtele2: {
        url: "https://harshitsiwach.github.io/webgl/",
        thumb_path: "/images/evm.png"  // Ensure the file exists at public/images/evm.png
    }
};

// Serve static files from the 'public' directory
server.use(express.static(path.join(__dirname, 'public')));

// Handle root route
server.get('/', (req, res) => {
    res.send('Hello, welcome to the Telegram game bot server.');
    console.log("Root route accessed");
});

// List available games with inline buttons and thumbnails
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "First Game (evmtele)",
                        callback_data: 'evmtele'
                    },
                    {
                        text: "Second Game (evmtele2)",
                        callback_data: 'evmtele2'
                    }
                ]
            ]
        }
    };
    const response = "Choose a game to play:";
    bot.sendMessage(chatId, response, options)
        .then(() => console.log("Start message sent with inline buttons"))
        .catch(err => console.error("Error sending start message:", err));
});

// Handle callback queries for inline buttons
bot.on("callback_query", (query) => {
    console.log("Received callback query:", query);
    const game = games[query.data];
    if (!game) {
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: `Sorry, '${query.data}' is not available.`,
            show_alert: true
        }).catch(err => console.error("Error sending callback query response:", err));
    } else {
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: game.url  // This URL will open in the in-app browser
        }).catch(err => console.error("Error sending game URL:", err));
    }
});

// Handle inline queries
bot.on("inline_query", (iq) => {
    console.log("Received inline query:", iq);
    const results = Object.keys(games).map((shortName, index) => ({
        type: "article",
        id: String(index),
        title: shortName,
        input_message_content: {
            message_text: `Play ${shortName}`
        },
        thumb_url: `http://localhost:${port}${games[shortName].thumb_path}`,
        description: `Click to play ${shortName}`
    }));
    bot.answerInlineQuery(iq.id, results)
        .then(() => console.log("Inline query answered"))
        .catch(err => console.error("Error answering inline query:", err));
});

// Serve the bot
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

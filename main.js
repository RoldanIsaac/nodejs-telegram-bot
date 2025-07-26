const TelegramBot = require("node-telegram-bot-api");
const createNote = require("./modules/notes.js").create;
const getAllNotes = require("./modules/notes.js").getAll;
const token = process.env.TELEGRAM_BOT_TOKEN;

// Crea el bot (modo polling)
const bot = new TelegramBot(token, { polling: true });

// ------------------------------------------------------------------------------------------
// @ Telegram Bot Methods
// ------------------------------------------------------------------------------------------

/**
 * On Send a Message
 */
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  // console.log(`Message received: ${message}`);

  const note = {
    title: "Note from telegram",
    content: message,
    chatId: chatId,
  };

  createNote(note).then((res) => {
    if (res.status === 200) {
      bot.sendMessage(chatId, `Note saved: ${res.message}`);
    } else {
      bot.sendMessage(chatId, `Error. Note couldn't be saved: ${res.message}`);
    }
  });
});

/**
 * 📋 On Get All Notes
 */
bot.onText(/\/getAll/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`Notas en las últimas 24h (${notas.length}):`, notas);

  getAllNotes().then((res) => {
    if (res.status === 200) {
      bot.sendMessage(chatId, `Note saved: ${res.message}`);
    } else {
      bot.sendMessage(
        chatId,
        `Error. Notes couldn't be fetched: ${res.message}`
      );
    }
  });

  //   const userNotas = notas[chatId] || [];
  //   if (userNotas.length === 0)
  //     return bot.sendMessage(chatId, "No tienes notas.");
  //   const lista = userNotas.map((n, i) => `${i + 1}. ${n}`).join("\n");
  //   bot.sendMessage(chatId, `📝 Tus notas:\n${lista}`);
});

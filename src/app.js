const TelegramBot = require("node-telegram-bot-api");
const createNote = require("../modules/notes.mjs").create;
const getAllNotes = require("../modules/notes.mjs").getAll;
const token = "8194752625:AAESqLONfQPiY1Yn_hIudEabB8B2In5aA7E";
// const token = process.env.TELEGRAM_BOT_TOKEN;

// Crea el bot (modo polling)
const bot = new TelegramBot(token, {
  polling: true, // verbose logging
  request: {
    timeout: 10000,
  },
});

// ------------------------------------------------------------------------------------------
// @ Telegram Bot Methods
// ------------------------------------------------------------------------------------------

// 👋 Inicio
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Hola ${msg.from.first_name}, soy tu bot con IA. Puedes:
- Escribirme cualquier cosa para que la IA te ayude.
- Usar /nota para guardar una nota.
- Usar /getAllNotes para ver tus notas.
- Usar /recordar para crear un recordatorio.
`
  );
});

/**
 * 📋 On Get All Notes
 */
bot.onText(/\/getAllNotes/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`Notas en las últimas 24h (${notas.length}):`, notas);

  getAllNotes(chatId).then((res) => {
    if (res.status === 200) {
      if (res.qty === 0) {
        bot.sendMessage(chatId, "No tienes notas en las últimas 24 horas.");
      } else {
        const lista = res.notes
          .map((n, i) => `📝 ${i + 1}. ${n.title}: ${n.content}`)
          .join("\n");

        bot.sendMessage(chatId, `📋 Notas de las últimas 24h:\n${lista}`);
      }
    } else {
      bot.sendMessage(
        chatId,
        `❌ Error: No se pudieron obtener las notas.\n${res.message}`
      );
    }
  });
});

// 📝 Guardar una nota
bot.onText(/\/note (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = match[1];
  // console.log(`Message received: ${message}`);

  const note = {
    title: "Note from telegram",
    content: message,
  };

  createNote(note, chatId).then((res) => {
    if (res.status === 200) {
      bot.sendMessage(chatId, `Note saved: ${res.message}`);
      bot.sendMessage(chatId, `Note saved: ${JSON.stringify(res.data)}`);
    } else {
      bot.sendMessage(chatId, `Error. Note couldn't be saved: ${res.message}`);
    }
  });
});

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
  };

  createNote(note, chatId).then((res) => {
    if (res.status === 200) {
      bot.sendMessage(chatId, `Note saved: ${res.message}`);
      bot.sendMessage(chatId, `Note saved: ${JSON.stringify(res.data)}`);
    } else {
      bot.sendMessage(chatId, `Error. Note couldn't be saved: ${res.message}`);
    }
  });
});

console.log("Listening on", 3000);

process.on("uncaughtException", (err) => {
  console.error("❗ uncaughtException:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❗ unhandledRejection:", reason);
});

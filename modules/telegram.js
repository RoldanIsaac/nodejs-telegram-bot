import * as TelegramBot from "node-telegram-bot-api";

// Cuando alguien envía un mensaje
bot.sendMessage(chatId, `Hola ${msg.from.first_name}, dijiste: "${message}"`);
// bot.onText(/\/start/, (msg: any) => {
//   bot.sendMessage(msg.chat.id, "¡Bienvenido a mi bot!");
// });

// sendMessage(chatId, "Elige una opción:", {
//   reply_markup: {
//     inline_keyboard: [
//       [{ text: "Google", url: "https://google.com" }],
//       [{ text: "Decir hola", callback_data: "saludo" }],
//     ],
//   },
// });

// bot.on("callback_query", (callbackQuery) => {
//   const data = callbackQuery.data;
//   const msg = callbackQuery.message;

//   if (data === "saludo") {
//     bot.sendMessage(msg.chat.id, "¡Hola! 👋");
//   }
// });

// 👋 Inicio
// bot.onText(/\/start/, (msg: any) => {
//   bot.sendMessage(
//     msg.chat.id,
//     `Hola ${msg.from.first_name}, soy tu bot con IA. Puedes:
// - Escribirme cualquier cosa para que la IA te ayude.
// - Usar /nota para guardar una nota.
// - Usar /vernotas para ver tus notas.
// - Usar /recordar para crear un recordatorio.
// `
//   );
// });

// // 🧠 Chat con IA
// bot.on("message", async (msg: any) => {
//   const chatId = msg.chat.id;
//   const texto = msg.text;

//   if (texto.startsWith("/")) return; // No procesar comandos aquí

//   try {
//     const respuesta = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: texto }],
//     });
//     const reply = respuesta.data.choices[0].message.content;
//     bot.sendMessage(chatId, reply);
//   } catch (err) {
//     console.error(err);
//     bot.sendMessage(chatId, "❌ Error al usar la IA.");
//   }
// });

// // 📝 Guardar una nota
// bot.onText(/\/nota (.+)/, (msg: any, match: any) => {
//   const chatId = msg.chat.id;
//   const texto = match[1];
//   if (!notas[chatId]) notas[chatId] = [];
//   notas[chatId].push(texto);
//   bot.sendMessage(chatId, "✅ Nota guardada.");
// });

// // ⏰ Recordatorios
// bot.onText(/\/recordar (.+) \| (.+)/, (msg: any, match: any) => {
//   const chatId = msg.chat.id;
//   const mensaje = match[1];
//   const tiempo = match[2]; // formato cron (ej: '*/1 * * * *' para cada minuto)

//   if (!recordatorios[chatId]) recordatorios[chatId] = [];

//   const tarea = cron.schedule(tiempo, () => {
//     bot.sendMessage(chatId, `🔔 Recordatorio: ${mensaje}`);
//   });

//   recordatorios[chatId].push({ mensaje, tiempo, tarea });
//   bot.sendMessage(chatId, "⏰ Recordatorio programado.");
// });

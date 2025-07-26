const knex = require("knex")(require("./knexfile").development);

// ------------------------------------------------------------------------------------------
// @ DB Methods
// ------------------------------------------------------------------------------------------

/**
 * 📝 Create new note
 * @param {string} title
 * @param {string} content
 */
export async function create(note) {
  return await knex("notas")
    .insert({
      title: note.title,
      content: note.content,
      chat_id: chatId,
    })
    .then((res) => {
      return { status: "200", message: "Note saved successfully" };
    })
    .error((err) => {
      return { status: "400", messge: "Error while saving note" };
    });
}

/**
 * 🔍 Get notes from last 24h
 */
export async function getAll() {
  const last24H = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const notas = await repo.find({
    // where: {
    //   createdAt: MoreThan(hace24Horas),
    // },
    order: {
      createdAt: "DESC",
    },
  });

  return {
    notas: notas,
    qty: notas.length,
    message: "Notes in the last 24H",
  };
}

// ------------------------------------------------------------------------------------------
// @ DB Methods - PostgreSQL con Node.js nativo
// ------------------------------------------------------------------------------------------
import { Pool } from "pg";

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "oli_telegram",
  password: "postgres",
  port: 5432,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
  max: 10, // máximo de conexiones en el pool
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Conexión fallida:", err);
  } else {
    console.log("✅ Conectado:", res.rows[0]);
  }
  pool.end();
});

// Función para inicializar la base de datos
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS Note (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        chatId TEXT NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla "Note" verificada/creada correctamente');
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  } finally {
    client.release();
  }
}

// Llama a la inicialización al cargar el módulo
initializeDatabase().catch(console.error);

/**
 * 📝 Create new note
 * @param {object} note - {title: string, content: string}
 * @param {string} chatId - ID del chat asociado
 */
export async function create(note, chatId) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO Note(title, content, chatId, createdAt) VALUES($1, $2, $3, $4) RETURNING *",
      [note.title, note.content, chatId, new Date()]
    );

    return {
      status: 200,
      message: "Note saved successfully",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Error saving note:", err);
    return {
      status: 400,
      message: "Error while saving note",
      error: err.message,
    };
  } finally {
    client.release();
  }
}

/**
 * 🔍 Get notes from last 24h
 * @param {string} chatId - ID del chat para filtrar (opcional)
 */
export async function getAll(chatId = null) {
  console.log("⏳ Intentando conectar a PostgreSQL...");
  const client = await pool.connect();
  console.log("✅ Conectado a PostgreSQL");
  const last24H = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    let query;
    let params;

    if (chatId) {
      query =
        "SELECT * FROM Note WHERE created_at >= $1 AND chat_id = $2 ORDER BY created_at DESC";
      params = [last24H, chatId];
    } else {
      query =
        "SELECT * FROM Note WHERE created_at >= $1 ORDER BY created_at DESC";
      params = [last24H];
    }

    const result = await client.query(query, params);

    return {
      status: 200,
      notes: result.rows,
      qty: result.rowCount,
      message: "Notes in the last 24H",
    };
  } catch (err) {
    console.error("Error retrieving notes:", err);
    return {
      status: 500,
      notes: [],
      qty: 0,
      message: "Error retrieving notes",
      error: err.message,
    };
  } finally {
    client.release();
  }
}

// Opcional: Función para inicializar la tabla si no existe
export async function initDB() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        chat_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS notes_created_at_idx ON Note(created_at);
      CREATE INDEX IF NOT EXISTS notes_chat_id_idx ON Note(chat_id);
    `);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
  }
}

export interface DBUser {
  id: number
  name: string
  email: string
  password: string
  avatar: string
}

export default defineNitroPlugin(async (nitroApp) => {
  const db = useDatabase();

  // Email / Password
  await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      avatar TEXT
    )`;
  // WebAuthn
  await db.sql`
    CREATE TABLE IF NOT EXISTS credentials (
      userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      id TEXT UNIQUE NOT NULL,
      publicKey TEXT NOT NULL,
      counter INTEGER NOT NULL,
      backedUp INTEGER NOT NULL,
      transports TEXT NOT NULL,
      PRIMARY KEY ("userId", "id")
    )`;
});

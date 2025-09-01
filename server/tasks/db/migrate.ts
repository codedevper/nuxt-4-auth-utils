export default defineTask({
  meta: {
    name: "db:migrate",
    description: "Run database migrations",
  },
  run({ payload, context }) {
    console.log(payload);
    console.log(context);
    console.log("Running DB migration task...");
    migration();
    return { result: "Success" };
  },
});

async function migration() {
  const db = useDatabase();

  // Create users table
  await db.sql`DROP TABLE IF EXISTS users`;
  // Email / Password
  await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT
    )`;

  // Create users table
  await db.sql`DROP TABLE IF EXISTS credentials`;
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
}

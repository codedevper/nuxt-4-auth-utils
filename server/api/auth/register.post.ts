import { z } from "zod";
import type { H3Event } from "h3";
import type { UserModel } from "#shared/types/models/user";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(9),
  password_confirmation: z.string().min(1)
})

interface DBUser {
  id: number
  name: string
  email: string
  password: string
}

interface Credentials {
  user: UserModel;
  tokens: {
    type: string;
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

const invalidCredentialsError = createError({
  statusCode: 422,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: 'Already credentials',
})

const invalidPasswordError = createError({
  statusCode: 400,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: 'Invalid password not match',
})

export default defineEventHandler(async (event) => {
  const { name, email, password, password_confirmation } = await readValidatedBody(event, bodySchema.parse)
  if (password !== password_confirmation) {
    throw invalidPasswordError
  }
  return await registerAPI(event)
});

async function register(event: H3Event) {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(9),
      password_confirmation: z.string().min(1),
    }).parse
  );

  const db = useDatabase();
  const userCheck = await db.sql<{ rows: DBUser[] }>`SELECT * FROM users WHERE email = ${email}`.then(result => result.rows[0])
  if (userCheck) {
    throw invalidCredentialsError
  }

  const hashedPassword = await hashPassword(password);
  await db.sql`INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`;
  const user = await db.sql<{ rows: DBUser[] }>`SELECT * FROM users WHERE email = ${email}`.then(result => result.rows[0])
  // In real applications, you should send a confirmation email to the user before logging them in.
  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      password: hashedPassword,
    },
    loggedInAt: Date.now(),
  });

  return setResponseStatus(event, 201);
}

async function registerAPI(event: H3Event) {
  const { name, email, password, password_confirmation } = await readValidatedBody(
    event,
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(9),
      password_confirmation: z.string().min(1),
    }).parse
  );

  try {
    const data = await $fetch<Credentials>("http://localhost:8000/api/auth/token/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: { name, email, password, password_confirmation },
    });
  
    await setUserSession(event, {
      user: data.user,
      secure: {
        tokens: data.tokens
      },
      loggedInAt: Date.now(),
    });
  
    return setResponseStatus(event, 201);
  } catch (error) {
    throw error
  }
}
import { z } from "zod";
import type { H3Event } from "h3";
import type { UserModel } from "#shared/types/models/user";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

interface DBUser {
  id: number;
  name: string;
  email: string;
  password: string;
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
  message: "Invalid credentials",
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);
  return await loginAPI(event);
});

async function login(event: H3Event) {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }).parse
  );

  const db = useDatabase();
  const user = await db.sql<{ rows: DBUser[] }>`SELECT * FROM users WHERE email = ${email}`.then(
    (result) => result.rows[0]
  );
  if (!user) {
    throw invalidCredentialsError;
  }
  if (!(await verifyPassword(user.password, password))) {
    throw invalidCredentialsError;
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    loggedInAt: Date.now(),
  });

  return setResponseStatus(event, 201);
}

async function loginAPI(event: H3Event) {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }).parse
  );

  try {
    const data = await $fetch<Credentials>("http://localhost:8000/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: { email, password },
    });

    await setUserSession(event, {
      user: data.user,
      secure: {
        tokens: data.tokens,
      },
      loggedInAt: Date.now(),
    });

    return setResponseStatus(event, 201);
  } catch (error) {
    throw error;
  }
}

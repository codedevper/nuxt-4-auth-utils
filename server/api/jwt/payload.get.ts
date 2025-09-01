import * as jose from "jose";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.jwt?.accessToken) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const secret = new TextEncoder().encode(process.env.NUXT_SESSION_PASSWORD);
    return await jose.jwtVerify(session.jwt?.accessToken, secret);
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: (error as Error).message,
    });
  }
});

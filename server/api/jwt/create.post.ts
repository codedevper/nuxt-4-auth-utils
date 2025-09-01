import * as jose from "jose";

export default defineEventHandler(async (event) => {
  // Get user from session
  const session = await getUserSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const secret = new TextEncoder().encode(process.env.NUXT_SESSION_PASSWORD);
  const alg = "HS256";

  // Generate tokens
  const accessToken = await new jose.SignJWT({ 'user:access:claim': true })
  .setProtectedHeader({ alg })
  .setIssuedAt()
  .setIssuer('http://localhost')
  .setSubject('user:access:claim')
  .setJti(`${session.id}`)
  .setAudience(`${session.user?.email}`)
  .setExpirationTime('30s')
  .sign(secret)

  const refreshToken = await new jose.SignJWT({ 'user:refresh:claim': true })
  .setProtectedHeader({ alg })
  .setIssuedAt()
  .setIssuer('http://localhost')
  .setSubject('user:refresh:claim')
  .setJti(`${session.id}`)
  .setAudience(`${session.user?.email}`)
  .setExpirationTime('7d')
  .sign(secret)

  await setUserSession(event, {
    jwt: {
      accessToken,
      refreshToken,
    },
    loggedInAt: Date.now(),
  });

  // Return tokens
  return {
    accessToken,
    refreshToken,
  };
});

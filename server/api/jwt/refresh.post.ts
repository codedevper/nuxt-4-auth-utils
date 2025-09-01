import * as jose from "jose";

const invalidUnauthorized = createError({
  statusCode: 401,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: "Unauthorized",
});

const invalidCredentialsError = createError({
  statusCode: 401,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: "refresh token is invalid",
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.jwt?.accessToken && !session.jwt?.refreshToken) {
    throw invalidUnauthorized;
  }

  const secret = new TextEncoder().encode(process.env.NUXT_SESSION_PASSWORD);
  const alg = "HS256";

  if (!(await jose.jwtVerify(session.jwt?.refreshToken, secret))) {
    throw invalidCredentialsError;
  }

  const accessToken = await new jose.SignJWT({ "user:access:claim": true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("http://localhost")
    .setSubject("user:access:claim")
    .setJti(`${session.id}`)
    .setAudience(`${session.user?.email}`)
    .setExpirationTime("30s")
    .sign(secret);

  await setUserSession(event, {
    jwt: {
      accessToken,
      refreshToken: session.jwt.refreshToken,
    },
    loggedInAt: Date.now(),
  });

  return {
    accessToken,
    refreshToken: session.jwt.refreshToken,
  };
});

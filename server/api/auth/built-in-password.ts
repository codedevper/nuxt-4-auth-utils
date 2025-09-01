export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)

  if (password !== process.env.NUXT_ADMIN_PASSWORD) {
    throw createError({
      statusCode: 401,
      message: 'Wrong password',
    })
  }
  await setUserSession(event, {
    user: {
      password: 'admin',
    },
    loggedInAt: Date.now(),
  })

  return {}
})

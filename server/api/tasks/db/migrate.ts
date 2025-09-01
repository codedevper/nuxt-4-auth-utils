export default defineEventHandler(async (event) => {
  // IMPORTANT: Authenticate user and validate payload!
  const payload = { ...getQuery(event) };
  const { result } = await runTask("db:migrate", { payload });

  return { result };
})

export default defineNitroPlugin((nitroApp) => {
  // Called when the session is fetched during SSR for the Vue composable (/api/_auth/session)
  // Or when we call useUserSession().fetch()
  sessionHooks.hook("fetch", async (session, event) => {
    // extend User Session by calling your database
    // or
    // throw createError({ ... }) if session is invalid for example
    console.log(session);
  });

  // Called when we call useUserSession().clear() or clearUserSession(event)
  sessionHooks.hook("clear", async (session, event) => {
    // Log that user logged out
    console.log('user logged out', session);
  });
});

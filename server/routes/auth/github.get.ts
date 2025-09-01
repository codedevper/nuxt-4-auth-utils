export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user, tokens }) {
    console.log(user);
    console.log(tokens);

    await setUserSession(event, {
      user: {
        github: user.login,
      },
      secure: {
        github: tokens
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, "/");
  },
});

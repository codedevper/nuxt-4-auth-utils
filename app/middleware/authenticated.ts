export default defineNuxtRouteMiddleware((to, from) => {
const { session:auth, loggedIn } = useUserSession()

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo('/auth/login')
  }
  console.log(auth.value);
})

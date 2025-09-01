<script lang="ts" setup>
definePageMeta({
  layout: "app-default",
  middleware: ["authenticated"],
});

const { session:auth, user, clear: clearSession } = useUserSession();
const { register, authenticate, isSupported } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register', // Default
  authenticateEndpoint: '/api/webauthn/authenticate', // Default
})

async function logout() {
  await clearSession();
  await navigateTo("/auth/login");
}

const logging = ref(false)
const userName = ref(user.value?.email)
const displayName = ref(user.value?.email)

async function signUp() {
  if (!user.value?.email) return
  logging.value = true
  await register({
    userName: user.value?.email,
    displayName: displayName.value,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    }).finally(()=>{{
      logging.value = false
    }})
}

async function signIn() {
  if (logging.value) return
  logging.value = true
  await authenticate(userName.value)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    }).finally(()=>{{
      logging.value = false
    }})
}

async function signJwt() {
 $fetch("/api/jwt/create", {
    method: "POST",
    body: {},
  }).then((result) => {
    console.log(result);
    
 }).catch((err) => {
    console.log(err);
 });
}
</script>

<template>
  <div v-if="auth" class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <h1>Welcome {{ auth.user?.name }}</h1>
    {{ isSupported }}
    <button v-if="!auth.user?.webauthn" @click="signUp">signUp passKey</button>
    <button v-if="auth.user?.webauthn" @click="signIn">signIn passKey</button>
    <button v-if="!auth?.jwt" @click="signJwt">signIn Jwt</button>
    <button @click="logout">Logout</button>
  </div>
  <div v-else class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="bg-muted/50 aspect-video rounded-xl" />
      <div class="bg-muted/50 aspect-video rounded-xl" />
      <div class="bg-muted/50 aspect-video rounded-xl" />
    </div>
    <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
  </div>
</template>

<style scoped>
/** */
</style>

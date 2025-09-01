<script lang="ts" setup>
definePageMeta({
  layout: "app-default",
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();
</script>

<template>
  <div v-if="user" class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <h1>Welcome {{ user.name }}</h1>
    <button @click="$router.push('/dashboard/overview')">dashboard</button>
  </div>
  <div v-else class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="bg-muted/50 aspect-video rounded-xl" />
      <div class="bg-muted/50 aspect-video rounded-xl" />
      <div class="bg-muted/50 aspect-video rounded-xl" />
    </div>
    <NuxtWelcome />
  </div>
</template>

<style scoped>
/** */
</style>

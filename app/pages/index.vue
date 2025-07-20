<script lang="ts" setup>
definePageMeta({
  layout: "main",
  middleware: ['authenticated'],
});
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<style scoped>
/** */
</style>
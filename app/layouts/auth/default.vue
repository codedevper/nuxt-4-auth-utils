<script lang="ts" setup>
import { GalleryVerticalEnd } from "lucide-vue-next"
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
    <div class="flex w-full max-w-md flex-col gap-6">
      <a href="/" class="flex items-center gap-2 self-center font-medium">
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd class="size-4" />
        </div>
        Acme Inc.
      </a>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/** */
</style>
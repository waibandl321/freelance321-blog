<template>
  <v-overlay
    v-if="loading"
    :model-value="loading"
    class="align-center justify-center"
    scroll-strategy="reposition"
  >
    <v-progress-circular
      color="white"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

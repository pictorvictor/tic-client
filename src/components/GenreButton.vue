<template>
  <button class="genre-button" @click="emit('click', genre)">
    {{ genre }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{ genre: string }>();
const emit = defineEmits(["click"]);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.genre-button {
  background-color: map-get($color-palette, muted-green);
  color: map-get($color-palette, light-beige);
  border: none;
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    background-color: map-get($color-palette, dark-gray);
  }
}
</style>

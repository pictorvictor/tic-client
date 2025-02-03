<template>
  <button
    class="genre-button"
    :class="{ active: props.isActive }"
    @click="emit('click', genre)"
  >
    {{ genre }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from "vue";

const props = defineProps<{ genre: string; isActive: boolean }>();
const emit = defineEmits(["click"]);

watch(
  () => props.isActive,
  (newVal) => {
    console.log(`Button "${props.genre}" active state:`, newVal);
  }
);
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

  &.active {
    background-color: map-get($color-palette, dark-gray);
    font-weight: bold;
    padding: 8px 16px;
  }
}
</style>

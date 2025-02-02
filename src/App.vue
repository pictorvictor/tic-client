<template>
  <div class="app-container">
    <NavbarComponent />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<style lang="scss">
@import "@/assets/styles/theme.scss";

body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: map-get($color-palette, dark-green);
}

.app-container {
  min-height: 100vh;
  background-color: map-get($color-palette, light-beige);
}

/* You can add more global styles here */
</style>

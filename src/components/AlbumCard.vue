<template>
  <div class="album-card">
    <img :src="album.image" :alt="album.title" class="album-image" />
    <div class="album-info">
      <!-- Album title -->
      <TextComponent variant="bold" class="album-title">{{
        album.title
      }}</TextComponent>
      <!-- Artist name -->
      <TextComponent variant="medium" class="album-artist"
        >by {{ album.artist }}</TextComponent
      >
      <!-- Genre -->
      <TextComponent variant="medium" class="album-genre">{{
        album.genre
      }}</TextComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import TextComponent from "@/components/TextComponent.vue";

const props = defineProps({
  album: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      artist: "",
      genre: "",
      image: "",
    }),
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss"; /* Import your color variables */

/* Album card styling */
.album-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 220px; /* Adjust width as needed */
}

.album-image {
  width: 100%;
  height: auto;
  border-bottom: 2px solid map-get($color-palette, dark-green);
}

.album-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align items to the left */
}

.album-title {
  font-size: 18px;
  color: map-get(
    $color-palette,
    dark-green
  ); /* Dark Green for the album title */
  margin: 5px 0;
  text-align: left; /* Align the title to the left */
}

.album-artist {
  font-size: 14px;
  color: map-get($color-palette, dark-gray); /* Dark Gray for artist text */
  margin: 5px 0;
  text-align: left; /* Align the artist to the left */
}

.album-genre {
  font-size: 12px;
  color: map-get($color-palette, muted-green); /* Muted Green for genre text */
  margin: 5px 0;
  text-align: left; /* Align the genre to the left */
}
</style>

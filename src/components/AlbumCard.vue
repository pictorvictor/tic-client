<template>
  <div class="album-card">
    <div @click="handleClick" class="album-card-link">
      <img :src="album.image" :alt="album.title" class="album-image" />
      <div class="album-info">
        <TextComponent variant="bold" class="album-title">{{
          album.title
        }}</TextComponent>
        <TextComponent variant="medium" class="album-artist"
          >by {{ album.artist }}</TextComponent
        >
        <TextComponent variant="medium" class="album-genre">{{
          album.genre
        }}</TextComponent>
      </div>
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
  },
  onClick: {
    type: Function,
    required: true,
  },
});

const handleClick = () => {
  props.onClick(props.album);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss"; /* Import your color variables */
.album-card {
  margin: 20px;
}
.album-image {
  height: 243px; /* Adjust height as needed */
  width: 243px;
  object-fit: cover;
  border: 1px solid rgba(#b8a894, 0.8);
}

.album-info {
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
  text-align: left; /* Align the title to the left */
}

.album-artist {
  font-size: 14px;
  margin-top: 5px;
  color: map-get($color-palette, dark-gray); /* Dark Gray for artist text */
  text-align: left; /* Align the artist to the left */
}

.album-genre {
  font-size: 12px;
  margin-top: 5px;
  color: map-get($color-palette, muted-green); /* Muted Green for genre text */
  text-align: left; /* Align the genre to the left */
}

.album-card-link {
  text-decoration: none; /* Remove underline by default */
  color: inherit; /* Ensure it inherits the text color */
  cursor: pointer; /* Show pointer on hover */

  &:hover {
    text-decoration: underline; /* Apply underline on hover */
  }
}
</style>

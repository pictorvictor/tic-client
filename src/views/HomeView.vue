<template>
  <div class="home-container">
    <div class="genre-sort">
      <GenreButton
        v-for="genre in albumStore.genres"
        :key="genre"
        :genre="genre"
        @click="filterByGenre(genre)"
      />
    </div>

    <div class="album-grid">
      <AlbumCard
        v-for="album in filteredAlbums"
        :key="album.id"
        :album="album"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AlbumCard from "@/components/AlbumCard.vue";
import GenreButton from "@/components/GenreButton.vue";
import { useAlbumStore } from "@/store/albumStore";

const albumStore = useAlbumStore();

onMounted(() => {
  albumStore.setAlbums([
    {
      id: "1",
      title: "Dreamscapes",
      artist: "Luna Wave",
      genre: "synthwave",
      image: "/assets/album1.jpg",
      tracks: [
        { id: "1", title: "Morning Breeze", url: "/tracks/morning-breeze.mp3" },
      ],
      downloadUrl: "/downloads/dreamscapes.zip",
    },
    {
      id: "2",
      title: "Synth Vibes",
      artist: "Neon Pulse",
      genre: "Synthwave",
      image: "/assets/album2.jpg",
      tracks: [{ id: "1", title: "Neon Night", url: "/tracks/neon-night.mp3" }],
      downloadUrl: "/downloads/synth-vibes.zip",
    },
  ]);
  albumStore.loadGenres();
});

const genreFilter = ref("all");

const filteredAlbums = computed(() => {
  if (genreFilter.value === "all") return albumStore.albums;
  return albumStore.albums.filter((album) => album.genre === genreFilter.value);
});

const filterByGenre = (genre: string) => {
  genreFilter.value = genre;
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss"; /* Import your color variables */

/* Home container styling */
.home-container {
  padding: 20px;
  background-color: map-get($color-palette, light-beige); /* Background color */
}

/* Genre filter buttons */
.genre-sort {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.genre-button {
  padding: 10px 20px;
  background-color: map-get($color-palette, muted-green); /* Muted Green */
  border: none;
  color: map-get($color-palette, light-beige); /* Light beige text */
  cursor: pointer;
  font-size: 14px;
}

.genre-button:hover {
  background-color: map-get($color-palette, dark-gray); /* Dark gray on hover */
}

/* Album grid */
.album-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  gap: 20px;
}
</style>

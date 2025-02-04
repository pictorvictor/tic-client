<template>
  <div class="home-container">
    <div class="genre-sort">
      <GenreButton
        v-for="genre in albumStore.genres"
        :key="genre"
        :genre="genre"
        @click="filterByGenre(genre)"
        :isActive="genreFilter === genre"
      />
    </div>

    <div class="album-grid">
      <AlbumCard
        v-for="album in filteredAlbums"
        :key="album.id"
        :album="album"
        @click="goToAlbumPage(album)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AlbumCard from "@/components/AlbumCard.vue";
import GenreButton from "@/components/GenreButton.vue";
import { useAlbumStore } from "@/store/albumStore";
import { useRouter } from "vue-router";

const albumStore = useAlbumStore();
const router = useRouter();

onMounted(() => {
  albumStore.fetchAlbums();
  albumStore.loadGenres();
});

const genreFilter = ref("all genres");

const filteredAlbums = computed(() => {
  if (genreFilter.value === "all genres") return albumStore.albums;
  return albumStore.albums.filter(
    (album) => album.genre.toLowerCase() === genreFilter.value
  );
});

const filterByGenre = (genre: string) => {
  genreFilter.value = genre;
};

const goToAlbumPage = (album: { id: string }) => {
  router.push(`/album/${album.id}`);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss"; /* Import your color variables */

/* Home container styling */
.home-container {
  padding: 20px 200px;
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

.album-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
}
</style>

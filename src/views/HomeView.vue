<template>
  <div class="home-container">
    <!-- Genre Sorting Buttons -->
    <div class="genre-sort">
      <button class="genre-button" @click="filterByGenre('all')">All</button>
      <button class="genre-button" @click="filterByGenre('rock')">Rock</button>
      <button class="genre-button" @click="filterByGenre('pop')">Pop</button>
      <button class="genre-button" @click="filterByGenre('hip-hop')">
        Hip-Hop
      </button>
      <button class="genre-button" @click="filterByGenre('electronic')">
        Electronic
      </button>
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
import { ref, computed } from "vue";
import AlbumCard from "@/components/AlbumCard.vue"; // Import the AlbumCard component

// Mock album data
const albums = ref([
  {
    id: 1,
    title: "Rock Anthem",
    artist: "Artist 1",
    genre: "rock",
    image: "/path/to/image1.jpg",
  },
  {
    id: 2,
    title: "Pop Hit",
    artist: "Artist 2",
    genre: "pop",
    image: "/path/to/image2.jpg",
  },
  {
    id: 3,
    title: "Hip-Hop Vibes",
    artist: "Artist 3",
    genre: "hip-hop",
    image: "/path/to/image3.jpg",
  },
  {
    id: 4,
    title: "Electronic Beats",
    artist: "Artist 4",
    genre: "electronic",
    image: "/path/to/image4.jpg",
  },
  {
    id: 5,
    title: "Indie Groove",
    artist: "Artist 5",
    genre: "rock",
    image: "/path/to/image5.jpg",
  },
]);

// Filter albums by genre
const genreFilter = ref("all");

const filteredAlbums = computed(() => {
  if (genreFilter.value === "all") return albums.value;
  return albums.value.filter((album) => album.genre === genreFilter.value);
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

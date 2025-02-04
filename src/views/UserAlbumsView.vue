<template>
  <div class="user-albums">
    <TextComponent variant="extra-bold" class="title"
      >manage your uploads</TextComponent
    >
    <div v-if="isLoading">loading albums...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="userAlbums.length === 0">no albums found :(</div>
    <div class="album-grid">
      <AlbumCard
        @click="editAlbum"
        v-for="album in userAlbums"
        :key="album.id"
        :album="album"
      />
    </div>

    <AlbumModal
      v-if="isModalOpen"
      :album="selectedAlbum"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAlbumStore } from "@/store/albumStore";
import AlbumModal from "@/components/AlbumModal.vue";
import { Album } from "@/store/albumStore";
import TextComponent from "@/components/TextComponent.vue";
import AlbumCard from "@/components/AlbumCard.vue";

const albumStore = useAlbumStore();
const isLoading = ref(false);
const error = ref<string | null>(null);
const isModalOpen = ref(false);
const selectedAlbum = ref<Album | null>(null);

onMounted(() => {
  albumStore.fetchUserAlbums();
});

const userAlbums = computed(() => albumStore.userAlbums);

const editAlbum = (album: Album) => {
  selectedAlbum.value = album;
  isModalOpen.value = true;
};
</script>

<style lang="scss" scoped>
.user-albums {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.album-grid {
  margin-left: 40px;
  display: grid;
  grid-template-columns: repeat(5, minmax(200px, 1fr));
  * {
    width: 243px;
  }
}

.actions button {
  margin-left: 10px;
}

.delete {
  color: red;
}

.title {
  margin-bottom: 20px;
  align-self: center;
}
</style>

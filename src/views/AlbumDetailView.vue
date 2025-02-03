<template>
  <div v-if="album" class="album-detail">
    <div class="album-header">
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

        <!-- Download Album Button -->
        <a
          v-if="album.downloadUrl"
          :href="album.downloadUrl"
          class="download-album-button"
          download
        >
          ⬇ Download Album
        </a>
      </div>
    </div>

    <div class="track-list">
      <div
        v-for="(track, index) in album.tracks"
        :key="track.id"
        class="track-item"
      >
        <TextComponent variant="medium" class="track-title">
          {{ index + 1 }}. {{ track.title }}
        </TextComponent>

        <div class="track-controls">
          <div class="progress-container" v-if="currentlyPlaying === track.id">
            <span class="timestamp">{{ formatTime(trackProgress) }}</span>
            <input
              type="range"
              min="0"
              :max="trackDuration"
              step="0.1"
              v-model="trackProgress"
              class="progress-slider"
              @input="seekTrack"
            />
            <span class="timestamp">{{ formatTime(trackDuration) }}</span>
          </div>

          <button class="play-button" @click="togglePlay(track.url, track.id)">
            {{ currentlyPlaying === track.id ? "⏹" : "▶" }}
          </button>
        </div>

        <TextComponent
          @click="downloadFile(track.url, track.title)"
          class="download-button"
          >⬇</TextComponent
        >
      </div>
    </div>

    <audio ref="audioPlayer" @timeupdate="updateProgress" @ended="resetTrack" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import TextComponent from "@/components/TextComponent.vue";
import { useAlbumStore, Album } from "@/store/albumStore";
import { getStorage, getBlob, ref as firebaseRef } from "firebase/storage";

const route = useRoute();
const audioPlayer = ref<HTMLAudioElement | null>(null);
const album = ref<Album | null>(null);
const currentlyPlaying = ref<string | null>(null);
const trackProgress = ref<number>(0);
const trackDuration = ref<number>(0);

const albumStore = useAlbumStore();

onMounted(() => {
  const albumId = route.params.id as string;
  album.value = albumStore.albums.find(
    (album) => album.id === albumId
  ) as Album;
});

const togglePlay = (url: string, trackId: string) => {
  console.log(url);
  if (!audioPlayer.value) return;

  if (currentlyPlaying.value === trackId) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    currentlyPlaying.value = null;
    trackProgress.value = 0;
  } else {
    if (currentlyPlaying.value) {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
    }

    audioPlayer.value.src = url;
    audioPlayer.value.play();
    currentlyPlaying.value = trackId;

    audioPlayer.value.onloadedmetadata = () => {
      trackDuration.value = audioPlayer.value!.duration;
    };

    audioPlayer.value.onended = () => {
      resetTrack();
    };
  }
};

const updateProgress = () => {
  if (audioPlayer.value) {
    trackProgress.value = audioPlayer.value.currentTime;
  }
};

const seekTrack = () => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = trackProgress.value;
  }
};

const resetTrack = () => {
  currentlyPlaying.value = null;
  trackProgress.value = 0;
};

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
};

const downloadFile = async (filePath: string, fileName: string) => {
  try {
    const storage = getStorage();
    const storageRef = firebaseRef(storage, filePath);
    const blob = await getBlob(storageRef);

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName || "file.mp3");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.album-detail {
  padding: 20px;
  background-color: map-get($color-palette, light-beige);
}

.album-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.album-image {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin-right: 20px;
  border: 2px solid map-get($color-palette, dark-green);
}

.album-info {
  display: flex;
  flex-direction: column;
}

.album-title {
  font-size: 22px;
  color: map-get($color-palette, dark-green);
}

.album-artist,
.album-genre {
  font-size: 16px;
  color: map-get($color-palette, dark-gray);
}

.download-album-button {
  background: map-get($color-palette, muted-green);
  color: white;
  border-radius: 5px;
  padding: 10px;
  text-decoration: none;
  text-align: center;
  margin-top: 10px;
  width: 150px;
}

.track-list {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid map-get($color-palette, muted-green);
}

.track-title {
  flex: 1;
  font-size: 14px;
  color: map-get($color-palette, dark-green);
}

.track-controls {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.progress-container {
  display: flex;
  margin-left: 0;
  gap: 5px;
}

.timestamp {
  font-size: 12px;
  color: map-get($color-palette, dark-gray);
  width: 35px;
  text-align: center;
}

.progress-slider {
  flex-grow: 1;
  appearance: none;
  background: map-get($color-palette, dark-gray);
  height: 5px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

.progress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: map-get($color-palette, muted-green);
  border-radius: 50%;
  cursor: pointer;
}

.play-button,
.download-button {
  background: map-get($color-palette, muted-green);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 0;
}
</style>

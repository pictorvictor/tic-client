<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button
          v-if="album.id"
          class="delete-album"
          @click="deleteAlbum(album.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="trash-icon"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M3 6h18v2H3zm3 3h12v11H6z" fill="currentColor"></path>
          </svg>
        </button>
        <div class="image-upload">
          <label for="image-upload" class="image-label">
            <img
              v-if="album.image"
              :src="album.image"
              alt="Album Cover"
              class="album-preview"
            />
            <span v-else>cover</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            hidden
          />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>title</label>
            <input v-model="album.title" required />
          </div>
          <div class="form-group">
            <label>artist</label>
            <input v-model="album.artist" required />
          </div>
          <div class="form-group">
            <label>genre</label>
            <input v-model="album.genre" required />
          </div>
        </div>

        <div class="tracks-section">
          <TextComponent variant="extra-bold" class="tracks-label"
            >tracks</TextComponent
          >
          <div
            v-for="(track, index) in album.tracks"
            :key="index"
            class="track-row"
          >
            <input v-model="track.title" placeholder="title" required />
            <span
              v-if="track.url"
              class="change-file-trigger"
              @click="() => (album.tracks[index].url = '')"
              >change file</span
            >
            <input
              v-else
              type="file"
              accept="audio/*"
              @change="(e) => handleTrackUpload(e, index)"
              required
              placeholder="track"
            />
            <button class="remove-track" @click="removeTrack(index)">X</button>
          </div>
          <button class="add-track" @click="addTrack">+</button>
        </div>

        <button
          class="add-album-button"
          @click="handleSubmit"
          :disabled="isUploading"
        >
          {{ album.id.length ? "update" : "add" }}
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
import { useAlbumStore } from "@/store/albumStore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import TextComponent from "./TextComponent.vue";
import { Album } from "@/store/albumStore";

const emit = defineEmits(["close"]);
const albumStore = useAlbumStore();
const storage = getStorage();
const props = defineProps<{ album: Album | null }>();

const album = ref(
  props.album
    ? { ...props.album }
    : {
        id: "",
        title: "",
        artist: "",
        genre: "",
        image: "",
        tracks: [{ title: "", url: "", id: "" }],
        downloadUrl: "",
      }
);

const isUploading = ref(false);

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  isUploading.value = true;
  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Invalid file type! Please upload an image.");
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("File is too large! Maximum size allowed is 2MB.");
    return;
  }

  const imageRef = storageRef(storage, `album_covers/${file.name}`);
  await uploadBytes(imageRef, file);
  album.value.image = await getDownloadURL(imageRef);
  isUploading.value = false;
};

const handleTrackUpload = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  isUploading.value = true;
  // Validate file type
  if (!file.type.startsWith("audio/")) {
    alert("Invalid file type! Please upload an audio file.");
    return;
  }

  // Validate file size (max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    alert("File is too large! Maximum size allowed is 20MB.");
    return;
  }

  // Check for duplicate file
  if (album.value.tracks.some((track) => track.url === file.name)) {
    alert("This track has already been added!");
    return;
  }

  const trackRef = storageRef(storage, `tracks/${file.name}`);
  await uploadBytes(trackRef, file);
  album.value.tracks[index].url = await getDownloadURL(trackRef);
  isUploading.value = false;
};

const addTrack = () => {
  album.value.tracks.push({ title: "", url: "", id: "" });
};

const removeTrack = (index: number) => {
  if (album.value.tracks.length === 1) return;
  const trackRef = storageRef(
    storage,
    `tracks/${album.value.tracks[index].url}`
  );
  deleteObject(trackRef);
  album.value.tracks.splice(index, 1);
};

const handleSubmit = () => {
  // Trim inputs
  album.value.title = album.value.title.trim();
  album.value.artist = album.value.artist.trim();
  album.value.genre = album.value.genre.trim();

  // Required fields validation
  if (!album.value.title || !album.value.artist || !album.value.genre) {
    alert("Please fill in all required fields.");
    return;
  }

  // Title length validation
  if (album.value.title.length < 3 || album.value.title.length > 50) {
    alert("Title must be between 3 and 50 characters.");
    return;
  }

  // Artist name length validation
  if (album.value.artist.length < 3 || album.value.artist.length > 50) {
    alert("Artist name must be between 3 and 50 characters.");
    return;
  }

  // Genre length validation
  if (album.value.genre.length < 3 || album.value.genre.length > 30) {
    alert("Genre must be between 3 and 30 characters.");
    return;
  }

  // Ensure album has at least one track
  if (album.value.tracks.length === 0) {
    alert("An album must contain at least one track.");
    return;
  }

  // Ensure all tracks have titles
  if (album.value.tracks.some((track) => !track.title.trim())) {
    alert("All tracks must have a title.");
    return;
  }

  // Ensure all tracks have valid URLs
  if (album.value.tracks.some((track) => !track.url)) {
    alert("Please upload all tracks before submitting.");
    return;
  }
  if (album.value.id) {
    albumStore.updateAlbum(album.value);
  } else {
    albumStore.addAlbum(album.value);
  }

  emit("close");
};

const deleteAlbum = async (albumId: string) => {
  if (!confirm("Are you sure you want to delete this album?")) return;
  await albumStore.deleteAlbum(albumId);

  emit("close");
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.image-label {
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: gray;
  cursor: pointer;
}

.album-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-grid {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.form-group {
  display: flex;
  margin-left: 30px;
  flex-direction: row;
  justify-content: space-between;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.tracks-section {
  width: 100%;
}

.track-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px;
}

.remove-track {
  background-color: map-get($color-palette, abort-red);
  color: map-get($color-palette, light-beige);
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  width: 50px;
  &:hover {
    background-color: map-get($color-palette, dark-gray);
  }
}

.add-track {
  background-color: map-get($color-palette, muted-green);
  color: map-get($color-palette, light-beige);
  border: none;
  padding: 5px;
  margin-left: 50px;
  cursor: pointer;
  border-radius: 5px;
  width: 50px;
  &:hover {
    background-color: map-get($color-palette, dark-gray);
  }
}

.add-album-button {
  background-color: map-get($color-palette, muted-green);
  color: map-get($color-palette, light-beige);
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 15px;

  &:hover {
    background-color: map-get($color-palette, dark-gray);
  }

  &:disabled {
    background-color: map-get($color-palette, dark-gray);
    cursor: not-allowed;
  }
}

.tracks-label {
  margin-left: 30px;
}

.change-file-trigger {
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: map-get($color-palette, muted-green);
  }
}

.tracks-label {
  text-decoration: underline;
}

.delete-album {
  cursor: pointer;
  background-color: map-get($color-palette, abort-red);
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 10;
  border: none;
  padding: 5px;
}
</style>

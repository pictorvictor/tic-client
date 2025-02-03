import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { getAuth } from "firebase/auth";

export interface Track {
  id: string;
  title: string;
  url: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  genre: string;
  image: string;
  tracks: Track[];
  downloadUrl: string;
}

export const useAlbumStore = defineStore("albumStore", () => {
  const albums = ref<Album[]>([]);
  const genres = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadGenres = () => {
    genres.value = [
      "all genres",
      ...new Set(albums.value.map((album) => album.genre.toLowerCase())),
    ];
  };

  const setAlbums = (newAlbums: Album[]) => {
    albums.value = newAlbums;
    loadGenres();
  };

  const addAlbum = async (album: Omit<Album, "id">) => {
    isLoading.value = true;
    error.value = null;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:3001/api/albums",
        album,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      albums.value.push(response.data);
      loadGenres();
    } catch (err) {
      error.value = "Failed to add album";
      console.error("Error adding album:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const getAlbumById = (id: string) => {
    return albums.value.find((album) => album.id === id);
  };

  const fetchAlbums = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const response = await axios.get("http://localhost:3001/api/albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlbums(response.data);
    } catch (err) {
      error.value = "Failed to fetch albums";
      console.error("Error fetching albums:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    albums,
    genres,
    isLoading,
    error,
    setAlbums,
    addAlbum,
    getAlbumById,
    loadGenres,
    fetchAlbums,
  };
});

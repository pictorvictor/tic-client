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
  const userAlbums = ref<Album[]>([]);
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

  const updateAlbum = async (album: Album) => {
    isLoading.value = true;
    error.value = null;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const response = await axios.put(
        `http://localhost:3001/api/albums/${album.id}`,
        album,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const index = albums.value.findIndex((a) => a.id === album.id);
      if (index !== -1) {
        albums.value.splice(index, 1, response.data);
      }
      const userIndex = userAlbums.value.findIndex((a) => a.id === album.id);
      if (userIndex !== -1) {
        console.log(response.data);
        userAlbums.value.splice(userIndex, 1, response.data);
      }

      loadGenres();
    } catch (err) {
      error.value = "Failed to update album";
      console.error("Error updating album:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAlbum = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      await axios.delete(`http://localhost:3001/api/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const index = albums.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        albums.value.splice(index, 1);
      }
      const userIndex = userAlbums.value.findIndex((a) => a.id === id);
      if (userIndex !== -1) {
        userAlbums.value.splice(userIndex, 1);
      }

      loadGenres();
    } catch (err) {
      error.value = "Failed to delete album";
      console.error("Error deleting album:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserAlbums = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const response = await axios.get(
        `http://localhost:3001/api/albums/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      userAlbums.value = response.data;
    } catch (err) {
      error.value = "Failed to fetch user albums";
      console.error("Error fetching user albums:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    albums,
    genres,
    isLoading,
    error,
    userAlbums,
    setAlbums,
    addAlbum,
    getAlbumById,
    loadGenres,
    fetchAlbums,
    updateAlbum,
    deleteAlbum,
    fetchUserAlbums,
  };
});

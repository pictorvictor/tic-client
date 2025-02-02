import { defineStore } from "pinia";
import { ref } from "vue";

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

  const loadGenres = () => {
    genres.value = [
      "all",
      ...new Set(albums.value.map((album) => album.genre)),
    ];
  };

  const setAlbums = (newAlbums: Album[]) => {
    albums.value = newAlbums;
    loadGenres();
  };

  const addAlbum = (album: Album) => {
    albums.value.push(album);
    loadGenres();
  };

  const getAlbumById = (id: string) => {
    return albums.value.find((album) => album.id === id);
  };

  return { albums, genres, setAlbums, addAlbum, getAlbumById, loadGenres };
});

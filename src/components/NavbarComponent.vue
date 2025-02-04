<template>
  <nav class="navbar">
    <div class="navbar-left">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 16" class="logo">
        <path d="M26.6 15.63L18.13 0H0l8.47 15.63z" fill="#1DA0C3" />
      </svg>
      <router-link to="/" class="brand-link">
        <TextComponent variant="extra-bold" class="brand-name"
          >campband</TextComponent
        >
      </router-link>
    </div>
    <div class="navbar-middle" v-if="user">
      <button @click="showModal = true" class="add-album-button">
        + add album
      </button>
    </div>
    <div v-if="user" class="navbar-right">
      <router-link to="/my-albums" class="nav-link navbar-right-item">
        <TextComponent variant="bold">(y)our albums</TextComponent>
      </router-link>
      <span>♬</span>
      <div @click="logout" class="logout-button navbar-right-item">
        <TextComponent variant="bold">logoff</TextComponent>
      </div>
    </div>
    <AlbumModal :album="null" v-if="showModal" @close="showModal = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import TextComponent from "@/components/TextComponent.vue";
import AlbumModal from "@/components/AlbumModal.vue";

const showModal = ref(false);

const user = ref<User | null>(null);
const router = useRouter();

let unsubscribe: () => void;

onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const logout = async (): Promise<void> => {
  await signOut(auth);
  router.push("/login");
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss"; /* Import your color variables */

.navbar {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  height: 60px;
  background-color: map-get($color-palette, muted-green);
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: -2.5px;
}

.brand-name {
  font-size: 30px;
  height: 35px;
  color: map-get($color-palette, light-beige);
}

.navbar-right {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 16px;
}

.navbar-right-item {
  align-items: center;
  display: flex;
  height: 100%;
  padding: 0 10px;
  transition: 0.3s;
  * {
    &:hover {
      color: map-get($color-palette, light-beige);
      cursor: pointer;
    }
  }

  &:last-child {
    padding-right: 20px;
  }
}

.nav-link {
  text-decoration: none;
  cursor: default;
}

.logout-button {
  background: map-get($color-palette, muted-green);
  color: white;
}

.add-album-button {
  background-color: map-get($color-palette, dark-gray);
  color: map-get($color-palette, light-beige);
  border: none;
  padding: 8px 12px;
  margin: 5px;
  margin-right: -20px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    background-color: map-get($color-palette, light-beige);
    color: map-get($color-palette, dark-gray);
  }
}
</style>

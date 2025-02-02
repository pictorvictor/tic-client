<template>
  <div class="login-container">
    <TextComponent variant="extra-bold" class="title">Login</TextComponent>

    <form @submit.prevent="loginWithEmail">
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>

    <TextComponent v-if="errorMessage" variant="medium" class="error">
      {{ errorMessage }}
    </TextComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import TextComponent from "@/components/TextComponent.vue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const loginWithEmail = async () => {
  errorMessage.value = "";
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (error: any) {
    errorMessage.value = "Invalid email or password.";
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  padding: 20px;
  max-width: 300px;
  margin: auto;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

button {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

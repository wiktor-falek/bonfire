<script setup lang="ts">
import { computed, ref } from "vue";
import { register } from "../api/auth";
import router from "../router";
import { AxiosError } from "axios";

const urlParams = new URLSearchParams(window.location.search);

const email = ref(urlParams.get("email") ?? "");
const displayName = ref("");
const username = ref("");
const password = ref("");
const errorMessage = ref("");

async function handleSubmit(e: Event) {
  e.preventDefault();

  const result = await register({
    email: email.value,
    displayName: displayName.value,
    username: username.value,
    password: password.value,
  });

  if (!result.ok) {
    if (result.err instanceof AxiosError) {
      errorMessage.value = "Something went wrong";
    } else {
      errorMessage.value = result.err.error;
    }
  } else {
    localStorage.setItem("authenticated", "true");
    router.push("/app/home");
  }
}

const loginRoute = computed(() => {
  return email.value === ""
    ? "/login"
    : `/login?email=${encodeURIComponent(email.value)}`;
});
</script>

<template>
  <main>
    <div class="auth-form">
      <h1>Create an account</h1>
      <form @submit="handleSubmit($event)">
        <label for="email" class="label-required">Email</label>
        <input
          v-model="email"
          required
          autocomplete="off"
          id="email"
          type="email"
          min="6"
          max="256"
        />

        <label for="displayName">Display Name</label>
        <input v-model="displayName" id="display-name" type="text" max="32" />

        <label for="username" class="label-required">Username</label>
        <input
          v-model="username"
          required
          id="username"
          type="text"
          min="3"
          max="32"
        />

        <label for="password" class="label-required">Password</label>
        <input
          v-model="password"
          required
          id="password"
          type="password"
          min="8"
          max="100"
        />

        <p class="error-message">{{ errorMessage }}</p>

        <button type="submit">Continue</button>
        <RouterLink :to="loginRoute" class="link"
          >Already got an account?</RouterLink
        >
      </form>
    </div>
  </main>
</template>

<style src="../styles/auth-form.css" scoped></style>
<style scoped>
main {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

h1 {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
}

h2 {
  color: var(--font-gray-1);
  text-align: center;
}

.error-message {
  color: #e65449;
}
</style>

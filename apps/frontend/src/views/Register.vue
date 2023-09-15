<script setup lang="ts">
import { computed, ref } from "vue";
import useRegister from "../api/auth/useRegister";
import router from "../router";

const urlParams = new URLSearchParams(window.location.search);

const email = ref(urlParams.get("email") ?? "");
const displayName = ref("");
const username = ref("");
const password = ref("");

const { isLoading, isError, error, isSuccess, mutate } = useRegister();

function handleSubmit(e: Event) {
  e.preventDefault();

  mutate(
    {
      email: email.value,
      displayName: displayName.value,
      username: username.value,
      password: password.value,
    },
    {
      onSuccess: (res) => {
        router.push("/channels/@me");
      },
    }
  );
}

const loginRoute = computed(() => {
  // Adds the email as a query parameter to auto-fill the field if it's provided.
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
          min="3"
          max="256"
        />

        <label for="displayName">Display Name</label>
        <input
          v-model="displayName"
          id="display-name"
          type="text"
          min="3"
          max="30"
        />

        <label for="username" class="label-required">Username</label>
        <input
          v-model="username"
          required
          id="username"
          type="text"
          min="3"
          max="30"
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
</style>

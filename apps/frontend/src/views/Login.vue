<script lang="ts" setup>
import { computed, ref } from "vue";
import useLogin from "../api/auth/useLogin";

const urlParams = new URLSearchParams(window.location.search);

const email = ref(urlParams.get("email") ?? "");
const password = ref("");

const { isLoading, isError, error, isSuccess, mutate } = useLogin();

function handleSubmit(e: Event) {
  e.preventDefault();

  mutate({ email: email.value, password: password.value });
}

function handlePasswordRecovery(e: MouseEvent) {
  e.preventDefault();
}

const registrationRoute = computed(() => {
  // Adds the email as a query parameter to auto-fill the field if it's provided.
  return email.value === ""
    ? "/register"
    : `/register?email=${encodeURIComponent(email.value)}`;
});
</script>

<template>
  <main>
    <div class="auth-form">
      <h1>Welcome Back!</h1>
      <!-- <h2>Find your place in our bonfire circle!</h2> -->
      <!-- <h2>Come closer to the warmth of the bonfire!</h2> -->
      <h2>Take a spot around the bonfire with us!</h2>

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

        <label for="password" class="label-required">Password</label>
        <input
          v-model="password"
          required
          id="password"
          type="password"
          min="8"
          max="100"
        />

        <button class="link" @click="handlePasswordRecovery($event)">
          Forgot your password?
        </button>

        <button type="submit">Log In</button>
        <p class="register">
          <span class="register-text"> Need an account?</span>
          <RouterLink :to="registrationRoute" class="link">Register</RouterLink>
        </p>
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

.register {
  font-size: 0.9rem;
  margin: 0;
  margin-top: 6px;
}

.register-text {
  color: var(--font-gray-1);
  margin-right: 0.5ch;
}
</style>

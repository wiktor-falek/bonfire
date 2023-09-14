<script setup lang="ts">
import { ref } from "vue";

const emailOrUsername = ref("");
const password = ref("");

function handleSubmit(e: Event) {
  e.preventDefault();
  console.log(emailOrUsername.value);
  console.log(password.value);
}

function handlePasswordRecovery(e: MouseEvent) {
  e.preventDefault();
}
</script>

<template>
  <main>
    <div class="login-form">
      <h1>Welcome Back!</h1>
      <!-- <h2>Find your place in our bonfire circle!</h2> -->
      <!-- <h2>Come closer to the warmth of the bonfire!</h2> -->
      <h2>Take a spot around the bonfire with us!</h2>

      <form @submit="handleSubmit($event)">
        <label for="email-or-username" class="label-required"
          >Email or Username</label
        >
        <input
          v-model="emailOrUsername"
          required
          id="email-or-username"
          type="text"
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

        <button @click="handlePasswordRecovery($event)">
          Forgot your password?
        </button>

        <button type="submit" class="login">Log In</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-form {
  padding: 20px;
  background-color: #313338;
  border-radius: 4px;
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

label {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--font-gray-1);
  text-transform: uppercase;
  display: block;
  margin-top: 16px;
  margin-bottom: 6px;
}

input {
  font-size: 1rem;
  height: 36px;
  padding: 2px 8px;
  border: none;
  display: block;
  width: 360px;
  border-radius: 2px;
  background-color: #1e1f22;
}

input[type="password"] {
  font-size: 1.4rem;
  letter-spacing: -2px;
}

.label-required::after {
  content: "*";
  color: red;
  font-size: 0.7rem;
  vertical-align: 0.1em;
  margin: 0 4px;
}

button[type="submit"] {
  height: 44px;
  border: none;
  background-color: #e96045;
  width: 100%;
  border-radius: 2px;
  margin-top: 24px;
  font-weight: bold;
  font-size: 1.05rem;
}
</style>

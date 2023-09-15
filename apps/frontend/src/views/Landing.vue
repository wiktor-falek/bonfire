<script setup lang="ts">
import Logo from "../components/Logo.vue";
</script>

<template>
  <header>
    <Logo />
  </header>
  <main>
    <h1>Imagine a campfire...</h1>
    <h2>
      ...where you and your friends can gather around, kindling connections with
      others. A place that radiates warmth, making everyday conversations and
      hangouts effortless. Welcome to Bonfire - Where friendship and community
      thrive.
    </h2>

    <div class="buttons">
      <button class="button">Download for Linux</button>
      <RouterLink to="/login" class="button"
        >Open Bonfire in browser</RouterLink
      >
    </div>
  </main>
</template>

<style scoped>
header {
  padding: 12px;
  display: flex;
  align-items: center;
}

h1 {
  text-align: center;
  font-size: 2.4rem;
  margin: 1.2rem 0;
}

h2 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: normal;
  max-width: 720px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}
.button {
  padding: 12px 32px;
  border-radius: 30px;
  border: none;
  background-color: #eee;
  color: black;
  font-size: 1.2rem;
}

.button:hover {
  background-color: #ccc;
}
</style>

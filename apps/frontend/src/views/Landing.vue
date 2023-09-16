<script setup lang="ts">
import Logo from "../components/Logo.vue";
</script>

<template>
  <header>
    <Logo />
  </header>
  <main>
    <section class="hero">
      <h1>Imagine a campfire...</h1>
      <h2>
        ...where you and your friends can gather around, kindling connections
        with others. A place that radiates warmth, making everyday conversations
        and hangouts effortless. Welcome to Bonfire - Where friendship and
        community thrive.
      </h2>

      <div class="buttons">
        <button class="button">Download for Linux</button>
        <RouterLink to="/login" class="button"
          >Open Bonfire in browser</RouterLink
        >
      </div>
    </section>
  </main>
</template>

<style scoped>
main,
header {
  padding: 0 25px;
  box-sizing: border-box;
}
.hero {
  max-width: 720px;
  margin: auto;
}

header {
  height: 80px;
  display: flex;
  align-items: center;
  margin: auto;
  max-width: 1200px;
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
  flex-wrap: wrap;
  width: fit-content;
  margin: auto;
  gap: 24px;
  margin-top: 24px;
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

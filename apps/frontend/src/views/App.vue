<script setup lang="ts">
import { onMounted, ref } from "vue";
import HamburgerMenu from "../components/HamburgerMenu.vue";

const loading = ref(true);

onMounted(() => {
  const MINIMUM_LOAD_TIME = 1000;
  const start = Date.now();
  // TODO: connect to socket server, watch server connection state
  const end = Date.now();
  const timeoutDuration = MINIMUM_LOAD_TIME - (end - start);

  setTimeout(() => {
    loading.value = false;
  }, timeoutDuration);
});
</script>

<template>
  <main class="loading" v-if="loading" @contextmenu.prevent>
    <p>Loading...</p>
  </main>
  <main v-else @contextmenu.prevent>
    <div class="header desktop-hide">
      <button class="menu">
        <HamburgerMenu></HamburgerMenu>
      </button>
    </div>

    <div class="content">
      <div class="buttons">
        <button>Explore communities</button>
        <button>Lorem Ipsum</button>
        <button>Lorem Ipsum</button>
      </div>

      <div class="news">
        <div class="news__banner">
          <img
            src="https://whatifgaming.com/wp-content/uploads/2022/03/Living-the-Mountain-Life.jpg"
            alt=""
          />
        </div>
        <div class="news__text">
          <h1>What's new?</h1>
          <ul>
            <li>foo</li>
            <li>bar</li>
            <li>baz</li>
          </ul>
          <h1>Lorem Ipsum</h1>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.loading {
  width: 100vw;
  height: 100vh;
  background-color: #2b2d31;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  width: 100vw;
  min-height: 100vh;
  background-color: #313338;
  user-select: none;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  height: 48px;
  min-height: 48px;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgb(107, 107, 107);
}

.content {
  padding: 10px 10px;
  margin: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
}

.buttons button {
  all: unset;
  cursor: pointer;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: #1c1e20;
  text-align: center;
  font-weight: bold;
}

.menu {
  all: unset;
  cursor: pointer;
}

.news {
  width: 100%;
  border-radius: 10px;
  background-color: #1c1e20;
}

.news__banner img {
  width: 100%;
  border-radius: 10px 10px 0 0;
}

.news__text {
  padding: 10px;
}
</style>

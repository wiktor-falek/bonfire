<script setup lang="ts">
import { onMounted, ref } from "vue";

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
  <div class="loading" v-if="loading">
    <p>Loading...</p>
  </div>
  <main v-else>
    <h1>App View</h1>
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
  height: 100vh;
  background-color: #313338;
}
</style>

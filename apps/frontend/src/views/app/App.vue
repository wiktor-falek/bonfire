<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseSidePanel from "../../components/side-panel/BaseSidePanel.vue";
import Bonfire from "../../components/Bonfire.vue";
import MobileSidePanel from "../../components/side-panel/MobileSidePanel.vue";
import useAppStore from "../../stores/appStore";

const appStore = useAppStore();
const loading = ref(true);

onMounted(() => {
  const MINIMUM_LOAD_TIME = 500;
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
    <Bonfire size="64" />
    <div class="loading__info-container">
      <strong>Did you know?</strong>
      <p>I hate my life. Because it sucks, a lot.</p>
    </div>
  </main>
  <main v-else @contextmenu.prevent>
    <div class="wrapper">
      <BaseSidePanel class="base-side-panel desktop-show" />

      <RouterView></RouterView>
    </div>
  </main>
  <MobileSidePanel
    :is-open="appStore.sidePanelIsOpen"
    @close="appStore.sidePanelIsOpen = false"
  />
</template>

<style scoped>
.wrapper {
  height: 100vh;
}

.loading {
  width: 100vw;
  height: 100vh;
  background-color: #2b2d31;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-sizing: border-box;
  text-align: center;
  padding: 30px;
}

.loading__info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

@media (min-width: 820px) {
  .wrapper {
    display: flex;
    flex-direction: row;
  }
}
</style>

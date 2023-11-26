<script setup lang="ts">
import Bonfire from "../../components/Bonfire.vue";
import SidePanel from "../../components/SidePanel.vue";
</script>

<template>
  <main class="loading" v-if="false" @contextmenu.prevent>
    <Bonfire size="64" />
    <div class="loading__info-container">
      <strong>Did you know?</strong>
      <p>Fun fact here (no fun is being had at the moment)</p>
    </div>
  </main>
  <main v-else @contextmenu.prevent>
    <div class="wrapper">
      <SidePanel />

      <div class="content">
        <RouterView></RouterView>
      </div>
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  height: 100vh;
}

.loading {
  width: 100vw;
  height: 100vh;
  /* background-color: #2b2d31; */
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

.content {
  width: 100%;
}

@media (min-width: 820px) {
  .wrapper {
    display: flex;
    flex-direction: row;
  }

  .content {
    margin-left: 300px;
  }
}
</style>

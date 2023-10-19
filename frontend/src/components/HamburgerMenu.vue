<script setup lang="ts">
import useAppStore from "../stores/appStore";
const appStore = useAppStore();
</script>

<template>
  <button class="hamburger-menu" @click="appStore.sidePanelIsOpen = true">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </button>
</template>

<style scoped>
.hamburger-menu {
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: 4px;
}
.line {
  display: block;
  width: 28px;
  height: 4px;
  border-radius: 5px;
  background-color: rgb(201, 201, 201);
}
</style>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

function handleClose() {
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click="handleClose" v-show="isOpen">
      <div @click.stop>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
</style>

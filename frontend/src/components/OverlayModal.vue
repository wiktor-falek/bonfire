<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

function handleClose(e: Event) {
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay-modal" @click="handleClose" v-show="isOpen">
      <div @click.stop>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay-modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
</style>

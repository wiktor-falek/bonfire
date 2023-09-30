<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

function handleClose() {
  console.log("close");
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
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

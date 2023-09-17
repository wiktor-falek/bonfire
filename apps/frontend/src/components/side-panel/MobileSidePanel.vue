<script setup lang="ts">
import BaseSidePanel from "./BaseSidePanel.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<template>
  <div class="overlay desktop-hide" v-show="isOpen" @click="close">
    <BaseSidePanel class="side-panel" />
  </div>
</template>

<style scoped>
.overlay {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  top: 0;
}

.side-panel {
  box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
  -webkit-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
  -moz-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
}
</style>

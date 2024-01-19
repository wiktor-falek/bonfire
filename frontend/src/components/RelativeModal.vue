<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

function handleClose() {
  emit("close");
}
</script>

<template>
  <OnClickOutside @trigger="handleClose">
    <div class="relative-modal" v-show="isOpen">
      <slot></slot>
    </div>
  </OnClickOutside>
</template>

<style scoped>
.relative-modal {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 50;
}
</style>

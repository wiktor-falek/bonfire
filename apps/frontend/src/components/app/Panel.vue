<script setup lang="ts">
const { borderBottom = false, borderTop = false } = defineProps<{
  borderBottom?: true;
  borderTop?: true;
}>();
</script>

<template>
  <div
    class="panel"
    :style="{
      'border-bottom': borderBottom && '1px solid var(--border-color-1)',
      'border-top': borderTop && '1px solid var(--border-color-1)',
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 0 10px;
  background-color: #292828;
}
</style>

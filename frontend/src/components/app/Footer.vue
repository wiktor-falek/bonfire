<script setup lang="ts">
</script>

<template>
  <div
    class="panel"
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
  border-top: 1px solid var(--border-color-1);
}
</style>

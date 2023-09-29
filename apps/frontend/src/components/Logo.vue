<script setup lang="ts">
import Bonfire from "./Bonfire.vue";
</script>
<template>
  <a class="logo" href="/">
    <Bonfire />
    <p class="logo__brand">Bonfire</p>
  </a>
</template>

<style scoped>
.logo {
  display: flex;
  user-select: none;
  align-items: center;
  gap: 10px;
}
.logo__brand {
  display: block;
  line-height: 1;
  padding: 0;
  margin: 0;
  font-size: 24px;
  letter-spacing: 0.07em;
  color: #e96045;
  font-weight: 700;
}
</style>

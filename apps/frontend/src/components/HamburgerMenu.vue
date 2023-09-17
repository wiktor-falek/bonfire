<template>
  <div class="hamburger-menu">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </div>
</template>

<style scoped>
.hamburger-menu {
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

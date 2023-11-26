<script setup lang="ts">
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Header from "../../components/app/Header.vue";
</script>

<template>
  <Header class="desktop-hide">
    <HamburgerMenu />
  </Header>

  <div class="content">
    <div class="buttons">
      <button>Explore communities</button>
      <button>Lorem Ipsum</button>
      <button>Lorem Ipsum</button>
    </div>

    <div class="news">
      <div class="news__banner">
        <img
          src="https://whatifgaming.com/wp-content/uploads/2022/03/Living-the-Mountain-Life.jpg"
          alt=""
        />
      </div>
      <div class="news__text">
        <strong>What's new?</strong>
        <ul>
          <li>foo</li>
          <li>bar</li>
          <li>baz</li>
        </ul>
        <strong>Lorem Ipsum</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
main {
  width: 100vw;
  min-height: 100vh;
  background-color: #313338;
  user-select: none;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 10px 10px;
  margin: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
}

.buttons button {
  all: unset;
  cursor: pointer;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: #1c1e20;
  text-align: center;
  font-weight: bold;
}

.news {
  width: 100%;
  border-radius: 10px;
  background-color: #1c1e20;
}

.news__banner img {
  width: 100%;
  border-radius: 10px 10px 0 0;
}

.news__text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
</style>

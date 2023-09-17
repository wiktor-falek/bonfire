<script setup lang="ts">
import Bonfire from "./Bonfire.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

type Server = {
  name: string;
  iconImgSrc: string;
};

const servers: Server[] = [
  {
    name: "test server 1",
    iconImgSrc: "",
  },
  {
    name: "test server 1",
    iconImgSrc: "",
  },
  {
    name: "test server 1",
    iconImgSrc: "",
  },
  {
    name: "test server 1",
    iconImgSrc: "",
  },
];
</script>

<template>
  <div class="overlay" v-show="isOpen" @click="close">
    <div class="side-panel" @click.stop>
      <div class="sidebar">
        <button class="sidebar__tile sidebar__direct-messages">
          <Bonfire size="36" />
        </button>
        <hr />
        <button v-for="server in servers" class="sidebar__tile"></button>
        <button class="sidebar__create-server">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="#27bf08"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v14m-7-7h14"
            />
          </svg>
        </button>
      </div>
      <div class="direct-messages">
        <strong class="direct-messages__heading">Direct Messages</strong>
        <div class="direct-messages__search">
          <input
            type="text"
            placeholder="Find Conversation..."
            class="direct-messages__search__find"
          />
          <button class="direct-messages__search__create">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#ddd"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m-7-7h14"
              />
            </svg>
          </button>
        </div>

        <div class="direct-messages__conversations">
          <!-- TODO: render conversations -->
        </div>
      </div>
    </div>
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
  height: 100%;
  width: 85%;
  max-width: 500px;
  position: relative;
  background-color: #2b2d31;
  display: flex;
  box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
  -webkit-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
  -moz-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
}

.sidebar {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  width: 88px;
  padding: 8px 8px;
  box-sizing: border-box;
  background-color: #212224;
  overflow-y: auto;
}

hr {
  width: 75%;
  margin: 0;
}

.sidebar__create-server,
.sidebar__tile {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(58, 56, 56);
  transition: border-radius 0.25s ease;
}

.sidebar__direct-messages:hover,
.sidebar__create-server:hover {
  background-color: #47484b;
}

.sidebar__tile:hover,
.sidebar__tile--rounded-corners {
  border-radius: 16px;
}

.direct-messages {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.direct-messages__heading {
  margin-top: 5px;
  margin-bottom: 15px;
}

.direct-messages__search {
  display: flex;
  justify-content: space-between;
  height: 36px;
  margin-bottom: 20px;
}

.direct-messages__search__find {
  border: none;
  background-color: #3d3e41;
  padding-left: 8px;
}

.direct-messages__search__create {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
}

.direct-messages__conversations {
  width: 100%;
  height: 100%;
  background-color: #3d3e41;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import Bonfire from "../Bonfire.vue";

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

type Conversation = {
  name: string;
};

const conversations = ref<Conversation[]>([
  { name: "mock user 1" },
  { name: "mock user 2" },
  { name: "mock user 3" },
  { name: "mock user 4" },
  { name: "mock user 5" },
  { name: "mock user 6" },
  { name: "mock user 7" },
  { name: "mock user 8" },
  { name: "mock user 9" },
  { name: "mock user 10" },
  { name: "mock user 11" },
  { name: "mock user 12" },
  { name: "mock user 13" },
  { name: "mock user 14" },
  { name: "mock user 15" },
  { name: "mock user 16" },
  { name: "mock user 17" },
  { name: "mock user 18" },
  { name: "mock user 19" },
  { name: "mock user 20" },
]);

function handleConversationClose(index: number) {
  conversations.value.splice(index, 1);
}
</script>

<template>
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
        <div
          class="direct-messages__conversations__conversation"
          v-for="(conversation, index) in conversations"
          :key="conversation.name"
        >
          <div
            class="direct-messages__conversations__conversation__image"
          ></div>
          <p class="direct-messages__conversations__conversation__name">
            {{ conversation.name }}
          </p>
          <button
            class="direct-messages__conversations__conversation__close"
            @click="handleConversationClose(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326a.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018a.751.751 0 0 1-.018-1.042L6.94 8L3.72 4.78a.75.75 0 0 1 0-1.06Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  height: 100vh;
  width: 85%;
  max-width: 300px;
  position: relative;
  background-color: #2b2d31;
  display: flex;
}

.sidebar {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-width: 64px;
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
  display: flex;
  flex-direction: column;
}

.direct-messages__heading {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
}

.direct-messages__search {
  display: flex;
  justify-content: space-between;
  height: 36px;
  margin-bottom: 12px;
  margin-left: 10px;
  gap: 8px;
}

.direct-messages__search__find {
  border: none;
  background-color: #212224;
  padding-left: 8px;
  width: 100%;
  text-overflow: ellipsis;
  border-radius: 4px;
}

.direct-messages__search__create {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  margin-right: 8px;
}

.direct-messages__conversations {
  width: 100%;
  height: 100%;
  /* background-color: #3d3e41; */
  overflow-y: auto;
  padding: 0 6px;
  box-sizing: border-box;
  /* TODO: style scrollbar */
}

.direct-messages__conversations__conversation {
  display: flex;
  align-items: center;
  height: 42px;
  border-radius: 4px;
  padding: 0 8px;
  gap: 10px;
}

.direct-messages__conversations__conversation:hover {
  background-color: #3b3c3d;
}

.direct-messages__conversations__conversation:hover > .direct-messages__conversations__conversation__close {
  display: block;
}

.direct-messages__conversations__conversation__image {
  background-color: #3a3838;
  border-radius: 50px;
}

.direct-messages__conversations__conversation__name {
  text-overflow: ellipsis;
}
.direct-messages__conversations__conversation__close {
  margin-left: auto;
  border: none;
  height: 32px;
  width: 32px;
  padding: 0;
  aspect-ratio: 1 / 1;
  background-color: inherit;
  color: #918d8d;
  display: none;
}

.direct-messages__conversations__conversation__close svg {
  width: 20px;
  height: 20px;
}

.direct-messages__conversations__conversation__close:hover {
  color: #dad1d1;
}
</style>

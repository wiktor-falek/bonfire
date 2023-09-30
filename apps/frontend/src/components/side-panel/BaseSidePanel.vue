<script setup lang="ts">
import { ref } from "vue";
import Bonfire from "../Bonfire.vue";
import router from "../../router";
import useAppStore from "../../stores/appStore";
import Modal from "../Modal.vue";

const appStore = useAppStore();

type Server = {
  name: string;
  imgSrc?: string;
};
const servers: Server[] = [
  {
    name: "test server 1",
  },
  {
    name: "test server 2",
  },
  {
    name: "test server 3",
  },
  {
    name: "test server 4",
  },
];

type Conversation = {
  name: string;
  id: string;
  imgSrc?: string;
};
const conversations = ref<Conversation[]>([
  { name: "Qbi", id: "112105366920516103331" },
]);

function handleConversationClose(index: number) {
  conversations.value.splice(index, 1);
}

function handleConversationClick(id: string) {
  appStore.sidePanelIsOpen = false;
  router.push(`/app/channel/${id}`);
}

const createConversationModalIsOpen = ref(false);

function handleOpenCreateConversationModal() {
  createConversationModalIsOpen.value = true;
}

function handleCloseCreateConversationModal() {
  createConversationModalIsOpen.value = false;
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
        <button
          class="direct-messages__search__create"
          @click="handleOpenCreateConversationModal"
        >
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
          @click="handleConversationClick(conversation.id)"
        >
          <div
            class="direct-messages__conversations__conversation__image"
          ></div>
          <p class="direct-messages__conversations__conversation__name">
            {{ conversation.name }}
          </p>
          <button
            class="direct-messages__conversations__conversation__close"
            @click.stop="handleConversationClose(index)"
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
      <div class="user-card">
        <div class="user-card__profile">
          <div class="user-card__profile__image"></div>
          <div class="user-card__profile__text">
            <p class="user-card__profile__text__display-name">
              {{ appStore.displayName }}
            </p>
            <p class="user-card__profile__text__username">
              @{{ appStore.username }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal
    :is-open="createConversationModalIsOpen"
    @close="handleCloseCreateConversationModal"
  >
    <div id="modal--create-conversation">
      <input type="text" placeholder="Search by username" />
      <button @click="">Start Conversation</button>
    </div>
  </Modal>
</template>

<style scoped>
#modal--create-conversation {
  width: 200px;
  height: 150px;
  background-color: #212224;
}
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
  cursor: pointer;
}

.direct-messages__conversations__conversation:hover {
  background-color: #3b3c3d;
}

.direct-messages__conversations__conversation:hover
  > .direct-messages__conversations__conversation__close {
  display: block;
}

.direct-messages__conversations__conversation__image {
  background-color: #3a3838;
  border-radius: 50px;
  height: 80%;
  aspect-ratio: 1 / 1;
  background-color: #47484b;
}

.direct-messages__conversations__conversation__name {
  text-overflow: ellipsis;
  color: #bdbcbc;
  font-weight: 600;
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

.user-card {
  display: flex;
  align-items: center;
  background-color: #232325;
  min-height: 48px;
}

.user-card__profile {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
}
.user-card__profile__image {
  height: 36px;
  aspect-ratio: 1 / 1;
  background-color: #47484b;
  border-radius: 50%;
}

.user-card__profile__text > * {
  line-height: 1.1;
}
</style>

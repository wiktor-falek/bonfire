<script setup lang="ts">
import { ref } from "vue";
import Bonfire from "./Bonfire.vue";
import router from "./../router";
import Modal from "./Modal.vue";
import emitter from "../emitter";
import getCurrentProfile from "../api/users/getCurrentProfile";
import { UserProfile } from "../api/users/getUserProfileById";
import { getDirectMessageChannelId } from "../utils/id";

emitter.on("openSidePanel", () => {
  isOpenOnMobile.value = true;
});

emitter.on("closeSidePanel", () => {
  isOpenOnMobile.value = false;
});

const isOpenOnMobile = ref(false);

const userProfile = ref<UserProfile>();

async function fetchUserProfile() {
  userProfile.value = await getCurrentProfile();
}

fetchUserProfile();

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

const userProfiles = ref<UserProfile[]>([
  {
    id: "755308752261532161188",
    username: "qbibubi",
    displayName: "Qbi",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "verylongmockerson",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
  {
    id: "755308752261532142069",
    username: "mockerson",
    displayName: "mock",
    imgSrc: "",
  },
]);

function handleConversationClose(index: number) {
  userProfiles.value.splice(index, 1);
}

async function handleConversationClick(profileId: string) {
  if (!userProfile.value?.id) return;

  isOpenOnMobile.value = false;

  const userId = userProfile.value.id;
  const channelId = await getDirectMessageChannelId(userId, profileId);
  router.push(`/app/channel/${channelId}`);
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
  <div
    class="overlay desktop-hide"
    v-if="isOpenOnMobile"
    @click="isOpenOnMobile = false"
  ></div>
  <div
    class="side-panel"
    :class="{
      'desktop-show': !isOpenOnMobile,
    }"
    @click.stop
  >
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
    <div class="main-panel">
      <div class="menu">
        <div class="menu__search">
          <input
            type="text"
            placeholder="Find Conversation..."
            class="menu__search__find"
          />
          <button
            class="menu__search__create"
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

        <RouterLink
          to="/app/home"
          @click="emitter.emit('closeSidePanel')"
          class="menu__option"
          :class="{
            'menu__option--selected':
              router.currentRoute.value.fullPath.includes('/app/home'),
          }"
          >Home</RouterLink
        >
        <RouterLink
          to="/app/friends"
          @click="emitter.emit('closeSidePanel')"
          class="menu__option"
          :class="{
            'menu__option--selected':
              router.currentRoute.value.fullPath.includes('/app/friends'),
          }"
          >Friends</RouterLink
        >
        <RouterLink
          to="/app/stuff"
          @click="emitter.emit('closeSidePanel')"
          class="menu__option"
          :class="{
            'menu__option--selected':
              router.currentRoute.value.fullPath.includes('/app/stuff'),
          }"
          >Stuff</RouterLink
        >
      </div>

      <strong class="direct-messages__heading">Direct Messages</strong>

      <div class="direct-messages">
        <div class="direct-messages__conversations">
          <div
            class="direct-messages__conversations__conversation"
            v-for="(profile, index) in userProfiles"
            :key="profile.username"
            @click="handleConversationClick(profile.id)"
          >
            <div
              class="direct-messages__conversations__conversation__image"
            ></div>
            <p class="direct-messages__conversations__conversation__name">
              {{ profile.displayName }}
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
      </div>

      <div class="user-card">
        <div class="user-card__profile">
          <div class="user-card__profile__image"></div>
          <div class="user-card__profile__text">
            <p class="user-card__profile__text__display-name">
              {{ userProfile?.displayName }}
            </p>
            <p class="user-card__profile__text__username">
              @{{ userProfile?.username }}
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
.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}

.side-panel {
  height: 100vh;
  width: 85%;
  max-width: 300px;
  background-color: #2b2d31;
  display: flex;
  height: 100%;
  z-index: 2;
  position: fixed;
}

@media (max-width: 819px) {
  .side-panel {
    /* makes it work well with the overlay when in desktop view */
    /* position: fixed; */

    box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
    -webkit-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
    -moz-box-shadow: 9px -4px 32px -6px rgba(20, 20, 20, 0.75);
  }
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

#modal--create-conversation {
  width: 200px;
  height: 150px;
  background-color: #212224;
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

.main-panel {
  width: 100%;
  max-width: 300px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu {
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu__option {
  all: unset;
  font-weight: bold;
  color: #bdbcbc;
  height: 42px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-radius: 4px;
  cursor: pointer;
}

.menu__option:hover:not(.menu__option--selected) {
  background-color: #38383a;
}

.menu__option--selected {
  background-color: #404146;
  transition: background-color 0.2s ease-out;
}

.direct-messages {
  flex: 1;
  overflow-y: auto;
}

.direct-messages__heading {
  padding-left: 16px;
  color: #918d8d;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.menu__search {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0;
  height: 42px;
  padding: 3px;
  padding-bottom: 9px;
  box-sizing: border-box;
  border-bottom: 1px solid #47484b;
}

.menu__search__find {
  border: none;
  background-color: #212224;
  padding-left: 8px;
  width: 100%;
  text-overflow: ellipsis;
  border-radius: 4px;
}

.menu__search__create {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.direct-messages__conversations {
  width: 100%;
  height: 100%;
  padding: 0 6px;
  box-sizing: border-box;
}

.direct-messages__conversations__conversation {
  height: 42px;
  padding: 0 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.direct-messages__conversations__conversation:hover {
  background-color: #3b3c3d;
}

.direct-messages__conversations__conversation:hover
  > .direct-messages__conversations__conversation__close {
  visibility: visible;
}

.direct-messages__conversations__conversation__image {
  background-color: #3a3838;
  border-radius: 50px;
  height: 80%;
  aspect-ratio: 1 / 1;
  background-color: #47484b;
  margin-right: 10px;
}

.direct-messages__conversations__conversation__name {
  color: #bdbcbc;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
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
  visibility: hidden;
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

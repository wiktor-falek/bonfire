<script setup lang="ts">
import { ref, watch } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Panel from "../../components/app/Panel.vue";
import getMessages, { type Message } from "../../api/messages/getMessages";
import formatTimestamp from "../../utils/formatTimestamp";
import socket, { socketEmitter } from "../../socket";
import getUserProfileById, {
  type UserProfile,
} from "../../api/users/getUserProfileById";
import getCurrentProfile from "../../api/users/getCurrentProfile";

const props = defineProps<{ channelId: string }>();

const messages = ref<Message[]>();

const currentUserProfile = ref<UserProfile>(); // TODO: move to store
const otherUserProfile = ref<UserProfile>();

const messagesDiv = ref<HTMLElement>();

const content = ref("");

function handleSendMessage() {
  const trimmedContent = content.value.trimEnd();
  if (
    trimmedContent === "" ||
    !currentUserProfile.value ||
    !otherUserProfile.value
  )
    return;
  socket.send(
    JSON.stringify({
      type: "chat:direct-message",
      data: {
        recipientId: otherUserProfile.value.id,
        content: trimmedContent,
      },
    })
  );

  content.value = "";
}

socketEmitter.on("chat:message", (message) => {
  messages.value?.push(message);
});

function loadMessagess(channelId: string) {
  getMessages(channelId).then((_messages) => {
    messages.value = _messages;
  });
}

// TODO: unhardcode userId
function loadUser(userId: string = "755308752261532161188") {
  // TODO: move to store
  getCurrentProfile().then((profile) => {
    currentUserProfile.value = profile;
  });

  getUserProfileById(userId).then((profile) => {
    otherUserProfile.value = profile;
  });
}

function load() {
  loadUser();
  loadMessagess(props.channelId);
}

load();

watch(props, () => {
  otherUserProfile.value = undefined;
  messages.value = [];
  load();
});
</script>

<template>
  <div id="channel">
    <Panel :border-bottom="true" class="panel--top">
      <HamburgerMenu id="hamburger-menu" class="desktop-hide" />

      <div class="flex-between">
        <div class="user-info">
          <p class="user-info__display-name">
            {{ otherUserProfile?.displayName }}
          </p>
          <p class="user-info__username">@{{ otherUserProfile?.username }}</p>
        </div>
        <div class="actions">
          <button class="actions__action"></button>
          <button class="actions__action"></button>
          <button class="actions__action"></button>
        </div>
      </div>
    </Panel>

    <div class="messages">
      <div class="message" v-for="message in messages" ref="messagesDiv">
        <div class="message__image"></div>
        <div class="message__wrapper">
          <div class="message__top">
            <p class="message__top__display-name">{{ message.senderId }}</p>
            <p class="message__top__date">
              {{ formatTimestamp(message.timestamp) }}
            </p>
          </div>
          <p class="message__content">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>

    <Panel :border-top="true" class="panel--bottom">
      <button class="actions__action"></button>
      <button class="actions__action"></button>
      <input
        class="panel--bottom__chat-input"
        type="text"
        v-model="content"
        @keyup.enter="handleSendMessage"
      />
      <button class="actions__action"></button>
    </Panel>
  </div>
</template>

<style scoped>
#channel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

#hamburger-menu {
  margin-right: 16px;
}

.panel--bottom {
  display: flex;
  gap: 12px;
}

.panel--bottom__chat-input {
  flex: 1;
}

.flex-between {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
}

.user-info > p {
  line-height: 1.1;
  font-size: 0.9em;
}

.user-info__display-name {
  font-weight: bold;
}

.user-info__username {
}

.actions {
  display: flex;
  gap: 12px;
}
.actions__action {
  height: 24px;
  aspect-ratio: 1 / 1;
  border: none;
  background-color: #535353;
  border-radius: 4px;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: #333333; */
  gap: 8px;
  overflow-y: scroll;
}

.message {
  display: flex;
  gap: 4px;
}

.message__wrapper {
  display: flex;
  flex-direction: column;
}

.message:hover {
  background-color: #3d3c3c;
}

.message__image {
  margin: 4px;
  height: 42px;
  aspect-ratio: 1 / 1;
  background-color: #535353;
  border-radius: 50%;
}
.message__top {
  display: flex;
  gap: 8px;
  align-items: center;
}
.message__top__display-name {
  font-weight: bold;
  cursor: pointer;
}
.message__top__display-name:hover {
  text-decoration: underline;
}

.message__top__date {
  cursor: default;
  font-size: 0.9em;
  color: #c9c3c3;
}

.message__content {
  word-break: break-all;
  /* overflow-x: hidden; */
  padding-right: 8px;
}
</style>

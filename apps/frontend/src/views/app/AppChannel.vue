<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Panel from "../../components/app/Panel.vue";
import useGetMessages from "../../api/messages/useGetMessages";
import useCreateMessage from "../../api/messages/useCreateMessage";
import formatTimestamp from "../../utils/formatTimestamp";

const { channelId } = defineProps<{ channelId: string }>();

const user = ref({
  displayName: "Qbi",
  username: "Qbibubi",
  id: "755308752261532161188",
});

const { data: messages } = useGetMessages(channelId);
const { mutate: createMessage } = useCreateMessage();

const messagesDiv = ref<HTMLElement>();

const content = ref("");

function handleSendMessage() {
  if (content.value === "") return;
  createMessage({ recipientId: user.value.id, content: content.value });
  content.value = "";
}
</script>

<template>
  <div id="channel">
    <Panel :border-bottom="true" class="panel--top">
      <HamburgerMenu id="hamburger-menu" class="desktop-hide" />

      <div class="flex-between">
        <div class="user-info">
          <p class="user-info__display-name">{{ user.displayName }}</p>
          <p class="user-info__username">@{{ user.username }}</p>
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
            <p class="message__top__display-name">Apdo</p>
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
      <input class="panel--bottom__chat-input" type="text" v-model="content" />
      <button class="actions__action" @click="handleSendMessage">S</button>
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
  background-color: #333333;
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
  height: 42px;
  aspect-ratio: 1 / 1;
  background-color: #535353;
  border-radius: 50%;
}
.message__top {
  display: flex;
  gap: 8px;
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
}

.message__content {
  word-break: break-all;
  /* overflow-x: hidden; */
  padding-right: 8px;
}
</style>

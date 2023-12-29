<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Header from "../../components/app/Header.vue";
import Footer from "../../components/app/Footer.vue";
import { getMessages, type Message } from "../../api/messages";
import formatTimestamp from "../../utils/formatTimestamp";
import socket, { socketEmitter } from "../../socket";
import type { UserProfile } from "../../api/users/getCurrentProfile";
import { useUserProfilesStore } from "../../stores/userProfilesStore";
import { getOtherParticipantProfileInDirectMessageChannel } from "../../api/channels";

const userProfilesStore = useUserProfilesStore();

socketEmitter.on("chat:message", (message) => {
  messages.value.push(message);
});

const props = defineProps<{ channelId: string }>();

const messages = ref<Message[]>([]);
const otherUserProfile = ref<UserProfile>();
const messagesDiv = ref<HTMLElement>();
const content = ref("");

function handleSendMessage() {
  const trimmedContent = content.value.trimEnd();
  if (trimmedContent === "" || !otherUserProfile.value) return;

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

async function loadMessagess(channelId: string) {
  const result = await getMessages(channelId);
  if (result.ok) {
    messages.value = result.val;
  }
}

async function loadUser(channelId: string) {
  let profile = userProfilesStore.directMessageChannelProfiles.get(channelId);
  if (profile === undefined) {
    const result = await getOtherParticipantProfileInDirectMessageChannel(
      channelId
    );
    if (result.ok) {
      const fetchedProfile = result.val;
      profile = fetchedProfile;
      userProfilesStore.setUserProfile(fetchedProfile);
    }
  }

  otherUserProfile.value = profile;
}

async function load() {
  loadMessagess(props.channelId);
  await loadUser(props.channelId);
  const username = otherUserProfile.value?.username;
  if (username) {
    document.title = `Bonfire | @${username}`;
  }
}

onBeforeMount(async () => {
  await load();
});

watch(props, async () => {
  // refetch profile and messages whenever the channelId changes
  otherUserProfile.value = undefined;
  messages.value = [];
  await load();
});
</script>

<template>
  <div id="channel">
    <Header>
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
    </Header>

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
      <!-- TODO: loading screen -->
      <!-- <div v-if="!messages?.length">
        <p>There are no messages in this channel</p>
      </div> -->
    </div>

    <Footer class="footer">
      <button class="actions__action"></button>
      <button class="actions__action"></button>
      <input
        class="footer__chat-input"
        type="text"
        v-model="content"
        @keyup.enter="handleSendMessage"
      />
      <button class="actions__action"></button>
    </Footer>
  </div>
</template>

<style scoped>
#channel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

#hamburger-menu {
  margin-right: 16px;
}

.footer {
  display: flex;
  gap: 12px;
}

.footer__chat-input {
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

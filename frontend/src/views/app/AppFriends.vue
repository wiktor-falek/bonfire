<script setup lang="ts">
import { computed, ref } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Header from "../../components/app/Header.vue";
import type { UserProfile } from "../../api/users";
import {
  postAcceptFriendInvite,
  postFriendInviteByUsername,
  postRejectFriendInvite,
} from "../../api/relationships";
import { useRelationshipsStore } from "../../stores/relationshipsStore";
import { useUserStore } from "../../stores/userStore";
import { getDirectMessageChannelId } from "../../utils/id";
import router from "../../router";
import { useUserProfilesStore } from "../../stores/userProfilesStore";
import { useDirectMessagesStore } from "../../stores/directMessagesStore";
import { mapUserStatusToDisplayText } from "../../utils/mapUserStatusToDisplayText";

const userStore = useUserStore();
const relationshipsStore = useRelationshipsStore();
const userProfilesStore = useUserProfilesStore();
const directMessagesStore = useDirectMessagesStore();

type FilterOption = "online" | "all" | "pending" | "blocked";
type MenuOption = FilterOption | "add-friend";

const selectedMenuOption = ref<MenuOption>(
  (localStorage.getItem("selectedMenuOption") as MenuOption) ?? "online"
);

const userProfiles = computed<UserProfile[]>(() => {
  switch (selectedMenuOption.value) {
    case "online":
      return relationshipsStore.relationships.friends.filter(
        (e) => e.status !== "offline"
      );
    case "all":
      return relationshipsStore.relationships.friends;
    case "pending":
      return relationshipsStore.relationships.pending;
    case "blocked":
      return relationshipsStore.relationships.blocked;
    default:
      return [];
  }
});

function selectMenuOption(option: MenuOption) {
  selectedMenuOption.value = option;
  localStorage.setItem("selectedMenuOption", option);
}

const inviteUsernameInput = ref("");
async function handleSendFriendInvite(username: string) {
  const result = await postFriendInviteByUsername(username);
  if (!result.ok) {
    const error = result.err;
    // TODO: display error
    return;
  }

  // TODO: display success
  // TODO: dispatch new pending friend invite to relationshipsStore
}

function handleProfileClick(profile: UserProfile) {
  if (!userStore.userProfile) {
    throw new Error("Current user profile does not exist");
  }

  const channelId = getDirectMessageChannelId(
    userStore.userProfile.id,
    profile.id
  );

  userProfilesStore.setDirectMessageChannelProfiles(channelId, profile);

  directMessagesStore.prependUserProfile(profile);

  router.push(`/app/channel/@me/${channelId}`);
}

async function handleAcceptInvite(profile: UserProfile) {
  const result = await postAcceptFriendInvite(profile.id);

  if (result.ok) {
    const { friends, pending } = relationshipsStore.relationships;

    const idx = pending.findIndex((e) => e.id === profile.id);

    const targetProfile = pending[idx];

    if (!targetProfile) {
      return;
    }

    pending.splice(idx, 1);
    friends.push(targetProfile);
  } else {
    // TODO: handle error
  }
}

async function handleDeclineInvite(profile: UserProfile) {
  const result = await postRejectFriendInvite(profile.id);

  if (result.ok) {
    const { pending } = relationshipsStore.relationships;

    const idx = pending.findIndex((e) => e.id === profile.id);

    pending.splice(idx, 1);
  } else {
    // TODO: handle error
  }
}
</script>

<template>
  <Header class="desktop-hide">
    <HamburgerMenu />
  </Header>

  <div class="navigation">
    <h1 class="header">Friends</h1>
    <div class="navigation__menu">
      <button
        @click="selectMenuOption('online')"
        class="navigation__menu__option"
        :class="{
          'navigation__menu__option--selected': selectedMenuOption === 'online',
        }"
      >
        Online
      </button>
      <button
        @click="selectMenuOption('all')"
        class="navigation__menu__option"
        :class="{
          'navigation__menu__option--selected': selectedMenuOption === 'all',
        }"
      >
        All
      </button>
      <button
        @click="selectMenuOption('pending')"
        class="navigation__menu__option"
        :class="{
          'navigation__menu__option--selected':
            selectedMenuOption === 'pending',
        }"
      >
        Pending
      </button>

      <button
        @click="selectMenuOption('blocked')"
        class="navigation__menu__option"
        :class="{
          'navigation__menu__option--selected':
            selectedMenuOption === 'blocked',
        }"
      >
        Blocked
      </button>

      <button
        @click="selectMenuOption('add-friend')"
        class="navigation__menu__option"
        :class="{
          'navigation__menu__option--selected':
            selectedMenuOption === 'add-friend',
        }"
        id="add-friend"
      >
        Add Friend
      </button>
    </div>
  </div>

  <div class="container">
    <div class="left">
      <div v-if="selectedMenuOption === 'add-friend'">
        <h1>Add Friend</h1>
        <input maxlength="32" v-model="inviteUsernameInput" type="text" />
        <button
          :disabled="inviteUsernameInput.length === 0"
          @click="handleSendFriendInvite(inviteUsernameInput)"
        >
          Send Friend Request
        </button>
      </div>

      <div v-else class="user-friends-section">
        <input type="text" name="" id="" class="search" placeholder="Search" />

        <p class="user-count">
          {{ selectedMenuOption != "all" ? selectedMenuOption : "All Friends" }}
          -
          {{ userProfiles.length }}
        </p>

        <div class="profiles" v-for="profile in userProfiles">
          <hr class="profile__separator" />
          <div @click="handleProfileClick(profile)" class="profile">
            <div class="profile__image">
              <img src="" />
            </div>
            <div class="profile__text">
              <p class="profile__names">
                <span class="profile__names__display-name">
                  {{ profile.displayName }}&nbsp;
                </span>
                <span class="profile__names__username">
                  {{ profile.username }}
                </span>
              </p>
              <p class="profile__status">
                {{ mapUserStatusToDisplayText(profile.status) }}
              </p>
            </div>
            <div
              class="profile__actions"
              v-if="selectedMenuOption == 'pending'"
            >
              <button @click.stop="handleAcceptInvite(profile)">Accept</button>
              <button @click.stop="handleDeclineInvite(profile)">
                Decline
              </button>
            </div>
            <div class="profile__actions" v-else>
              <button>Message</button>
              <button @click.stop="() => {}">More</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <h1 class="header">Active Now</h1>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex: 1 200px;
}

.left {
  flex: 1;
}

.right {
  width: 352px;
  display: flex;
}

@media (max-width: 1264px) {
  .right {
    display: none;
  }
}

.navigation {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 32px;
  height: 48px;
  display: flex;
  max-height: fit-content;
  gap: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #47484b;
  margin-bottom: 10px;
}

.header {
  font-weight: bold;
}

.navigation__menu {
  display: flex;
  gap: 8px;
}

.navigation__menu__option {
  all: unset;
  cursor: pointer;
  padding: 0 12px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #ccc;
}

.navigation__menu__option:hover {
  color: #eee;
  background-color: #404042;
}

.navigation__menu__option:active {
  color: white;
}

.navigation__menu__option--selected {
  color: white !important;
  background-color: #4d4d50;
  cursor: default;
}

#add-friend {
  color: white;
  background-color: #e96434;
}

#add-friend.navigation__menu__option--selected {
  color: #ff652c !important;
  background: none;
}

.search {
  all: unset;
  border-radius: 4px;
  padding-left: 5px;
  --margin-x: 32px;
  width: calc(100% - calc(var(--margin-x) * 2));
  margin-left: var(--margin-x);
  margin-right: var(--margin-x);
  margin-bottom: 16px;
  box-sizing: border-box;
  height: 2em;
  background-color: #212224;
}

.user-count {
  margin-left: 28px;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #918d8d;
  font-weight: bold;
}

.profiles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 20px;
}

.profile__separator {
  border-top: 1px solid #404146;
  margin: -1px 10px -3px 10px;
  box-sizing: border-box;
}

.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  border-radius: 8px;
  gap: 12px;
  padding: 0 10px;
}

@media (min-width: 820px) {
  .profile {
    height: 64px;
  }

  .profile__image {
    margin-bottom: 4px;
  }
}

.profile:hover {
  background-color: #404146;
  cursor: pointer;
}

.profile__image {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  border: none;
  background-color: #404146;
}

.profile__text {
  display: flex;
  flex-direction: column;
}

.profile__status {
  display: none;
}

.profile__actions {
  margin-left: auto;
}

@media (min-width: 820px) {
  .profile__status {
    display: block;
  }
}

.profile__names__username {
  color: gray;
}
</style>

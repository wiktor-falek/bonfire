<script setup lang="ts">
import { ref } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Header from "../../components/app/Header.vue";
import type { UserProfile } from "../../api/users/getUserProfileById";

type MenuOption = "online" | "offline" | "pending";

const selectedMenuOption = ref<MenuOption>("online");

type Status = "online" | "away" | "dnd" | "offline";

type UserProfileWithStatus = UserProfile & { status: Status };

// TODO: get status of each user

const friendProfiles = ref<UserProfileWithStatus[]>([
  { displayName: "mock", username: "mockerson", id: "123", status: "offline" },
  { displayName: "mock", username: "mockerson", id: "123", status: "offline" },
  { displayName: "mock", username: "mockerson", id: "123", status: "offline" },
]);

const statusTextMap: Record<Status, string> = {
  online: "Online",
  away: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

function selectMenuOption(option: MenuOption) {
  selectedMenuOption.value = option;
}
</script>

<template>
  <Header class="desktop-hide">
    <HamburgerMenu />
  </Header>

  <div class="friends">
    <div class="navigation">
      <div class="navigation__top">
        <h1 class="title">Friends</h1>
        <button class="add-friend">+ Add Friend</button>
      </div>

      <div class="wrapper">
        <div class="navigation__menu">
          <button
            class="navigation__menu__option"
            @click="selectMenuOption('online')"
          >
            Online
          </button>
          <button
            class="navigation__menu__option"
            @click="selectMenuOption('offline')"
          >
            Offline
          </button>
          <button
            class="navigation__menu__option"
            @click="selectMenuOption('pending')"
          >
            Pending
          </button>
        </div>

        <input type="text" name="" id="" class="search" placeholder="Search" />
      </div>
    </div>

    <div class="profiles" v-for="profile in friendProfiles">
      <hr class="profile__separator" />
      <!-- <div class="separator"></div> -->
      <div class="profile">
        <div class="profile__image">
          <img src="" />
        </div>
        <div class="profile__text">
          <p class="profile__names">
            <span class="profile__names__display-name"
              >{{ profile.displayName }}&nbsp;</span
            >
            <span class="profile__names__username">{{ profile.username }}</span>
          </p>
          <p class="profile__status">
            {{ statusTextMap[profile.status] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friends {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
}

.navigation {
  display: flex;
  flex-direction: column;
  max-height: fit-content;
  width: 100%;
  gap: 10px;
  align-items: center;
  max-width: 300px;
  box-sizing: border-box;
}

.navigation__top {
  display: flex;
  max-height: fit-content;
  justify-content: space-between;
  width: 100%;
}

.title {
  font-weight: bold;
}

.navigation__menu {
  display: flex;
  font-weight: bold;
  font-size: 0.9rem;
  gap: 4px;
  margin-bottom: 8px;
}

.navigation__menu > * {
  all: unset;
  cursor: pointer;
  background-color: #38383a;
  padding: 2px 16px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color-1);
  border-radius: 8px;
}

.add-friend {
  all: unset;
  cursor: pointer;
  font-weight: bold;
}

.search {
  all: unset;
  border-radius: 4px;
  padding-left: 5px;
  box-sizing: border-box;
  margin-bottom: 8px;
  width: 100%;
  height: 2em;
  background-color: #212224;
}

.profiles {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.profile:hover {
  background-color: #404146;
  cursor: pointer;
}

.profile__image {
  height: 36px;
  width: 36px;
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

@media (min-width: 820px) {
  .profile__status {
    display: block;
  }
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import HamburgerMenu from "../../components/HamburgerMenu.vue";
import Header from "../../components/app/Header.vue";
import type { UserProfile } from "../../api/users/getUserProfileById";

type MenuOption = "online" | "offline" | "pending" | "blocked" | "add-friend";
type Status = "online" | "away" | "dnd" | "offline";
type UserProfileWithStatus = UserProfile & { status: Status };

const selectedMenuOption = ref<MenuOption>("online");

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

  <div class="navigation">
    <h1 class="header">Friends</h1>
    <div class="navigation__menu">
      <button
        @click="selectMenuOption('online')"
        class="navigation__menu__option"
      >
        Online
      </button>
      <button
        @click="selectMenuOption('offline')"
        class="navigation__menu__option"
      >
        Offline
      </button>
      <button
        @click="selectMenuOption('pending')"
        class="navigation__menu__option"
      >
        Pending
      </button>

      <button
        @click="selectMenuOption('blocked')"
        class="navigation__menu__option"
      >
        Blocked
      </button>

      <button
        @click="selectMenuOption('add-friend')"
        class="navigation__menu__option"
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
        <input type="text" />
      </div>

      <div v-else class="user-friends-section">
        <input type="text" name="" id="" class="search" placeholder="Search" />
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
                <span class="profile__names__username">{{
                  profile.username
                }}</span>
              </p>
              <p class="profile__status">
                {{ statusTextMap[profile.status] }}
              </p>
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
  display: flex;
  max-height: fit-content;
  gap: 10px;
  box-sizing: border-box;
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
  background-color: #38383a;
  padding: 0 12px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

#add-friend {
  background-color: #e26031;
}

.search {
  all: unset;
  border-radius: 4px;
  padding-left: 5px;
  --margin-x: 32px;
  width: calc(100% - calc(var(--margin-x) * 2));
  margin-left: var(--margin-x);
  margin-right: var(--margin-x);
  margin-bottom: 12px;
  box-sizing: border-box;
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

@media (min-width: 820px) {
  .profile__status {
    display: block;
  }
}
</style>

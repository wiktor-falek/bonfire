<script setup lang="ts">
import { onBeforeMount } from "vue";
import Bonfire from "../../components/Bonfire.vue";
import SidePanel from "../../components/SidePanel.vue";
import { getRelationships } from "../../api/relationships";
import { useUserStore } from "../../stores/userStore";
import { useRelationshipsStore } from "../../stores/relationshipsStore";
import { useUserProfilesStore } from "../../stores/userProfilesStore";
import { getCurrentProfile } from "../../api/users";

const userStore = useUserStore();
const relationshipsStore = useRelationshipsStore();
const profilesStore = useUserProfilesStore();

onBeforeMount(async () => {
  const getCurrentProfileResult = await getCurrentProfile();
  if (getCurrentProfileResult.ok) {
    const profile = getCurrentProfileResult.val;
    userStore.setUserProfile(profile);
  }

  const getRelationshipsResult = await getRelationships();
  if (getRelationshipsResult.ok) {
    const relationships = getRelationshipsResult.val;
    const { friends, pending, blocked } = relationships;
    relationshipsStore.setRelationships(relationships);
    profilesStore.setUserProfiles([...friends, ...pending, ...blocked]);
  }
});
</script>

<template>
  <main class="loading" v-if="false" @contextmenu.prevent>
    <Bonfire size="64" />
    <div class="loading__info-container">
      <strong>Did you know?</strong>
      <p>Fun fact here (no fun is being had at the moment)</p>
    </div>
  </main>
  <main v-else @contextmenu.prevent>
    <div class="wrapper">
      <SidePanel />

      <div class="content">
        <RouterView></RouterView>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  user-select: none;
}

.wrapper {
  height: 100vh;
}

.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-sizing: border-box;
  text-align: center;
  padding: 30px;
}

.loading__info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.content {
  width: 100%;
}

@media (min-width: 820px) {
  .wrapper {
    display: flex;
    flex-direction: row;
  }

  .content {
    margin-left: 300px;
  }
}
</style>

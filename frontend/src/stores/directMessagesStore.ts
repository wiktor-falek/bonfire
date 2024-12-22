import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserProfilesByIds, type UserProfile } from "../api/users";
import { useUserProfilesStore } from "./userProfilesStore";
import WebSocketClient from "../socket";

/**
 * Store that manages profiles in direct messages. They are entirely client side
 * and are persisted using localStorage.
 */
export const useDirectMessagesStore = defineStore("directMessages", () => {
  const socket = WebSocketClient.getInstance();

  socket.on("subscription:user-profile:status", ({ profileId, status }) => {
    const profile = userProfiles.value.find((p) => p.id === profileId);
    if (!profile) {
      return console.error("Tried to update subscribed profile, found none");
    }

    profile.status = status;
  });

  socket.on(
    "subscription:user-profile:displayName",
    ({ profileId, displayName }) => {
      const profile = userProfiles.value.find((p) => p.id === profileId);
      if (!profile) {
        return console.error("Tried to update subscribed profile, found none");
      }

      profile.displayName = displayName;
    }
  );

  const userProfiles = ref<UserProfile[]>([]);

  _retrievePersistedUserProfiles().then((profiles) => {
    userProfiles.value = userProfiles.value.concat(profiles);
  });

  function _persistUserProfiles() {
    localStorage.setItem("directMessages", JSON.stringify(userProfiles.value));
  }

  async function _retrievePersistedUserProfiles() {
    const userProfilesStore = useUserProfilesStore();

    const localProfiles = JSON.parse(
      localStorage.getItem("directMessages") || "[]"
    ) as UserProfile[];

    const getProfilesResult = await getUserProfilesByIds(
      localProfiles.map((p) => p.id)
    );

    if (!getProfilesResult.ok) {
      return [];
    }

    const profiles = getProfilesResult.val;

    userProfilesStore.setUserProfiles(profiles);

    return profiles;
  }

  function prependUserProfile(profile: UserProfile) {
    const profileAlreadyExists = userProfiles.value.some(
      (p) => p.id === profile.id
    );

    if (profileAlreadyExists) {
      return;
    }

    userProfiles.value.unshift(profile);

    _persistUserProfiles();
  }

  function bringProfileToTop(profile: UserProfile) {
    const idx = userProfiles.value.findIndex((p) => p.id === profile.id);
    const profileAlreadyExists = idx !== -1;

    if (!profileAlreadyExists) {
      return;
    }

    userProfiles.value.splice(idx, 1);
    userProfiles.value.unshift(profile);

    _persistUserProfiles();
  }

  function deleteUserProfileById(profileId: string) {
    const idx = userProfiles.value.findIndex(
      (profile) => profile.id === profileId
    );
    if (idx !== -1) {
      userProfiles.value.splice(idx, 1);
      _persistUserProfiles();
    }
  }

  return {
    userProfiles,
    prependUserProfile,
    bringProfileToTop,
    deleteUserProfileById,
  };
});

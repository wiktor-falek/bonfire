import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserProfile } from "../api/users";

export const useDirectMessagesStore = defineStore("directMessages", () => {
  const userProfiles = ref<UserProfile[]>(
    JSON.parse(localStorage.getItem("directMessages") || "[]")
  );

  const _persistUserProfiles = () => {
    localStorage.setItem("directMessages", JSON.stringify(userProfiles.value));
  };

  const prependUserProfile = (profile: UserProfile) => {
    const profileAlreadyExists = userProfiles.value.some(
      (p) => p.id === profile.id
    );

    if (profileAlreadyExists) {
      return;
    }

    userProfiles.value.unshift(profile);

    _persistUserProfiles();
  };

  const bringProfileToTop = (profile: UserProfile) => {
    const idx = userProfiles.value.findIndex((p) => p.id === profile.id);
    const profileAlreadyExists = idx !== -1;

    if (!profileAlreadyExists) {
      return;
    }

    userProfiles.value.splice(idx, 1);
    userProfiles.value.unshift(profile);

    _persistUserProfiles();
  };

  const deleteUserProfileById = (profileId: string) => {
    const idx = userProfiles.value.findIndex(
      (profile) => profile.id === profileId
    );
    if (idx !== -1) {
      userProfiles.value.splice(idx, 1);
      _persistUserProfiles();
    }
  };

  return {
    userProfiles,
    prependUserProfile,
    bringProfileToTop,
    deleteUserProfileById,
  };
});

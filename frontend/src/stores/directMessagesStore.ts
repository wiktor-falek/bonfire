import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserProfile } from "../api/users";

export const useDirectMessagesStore = defineStore("directMessages", () => {
  const userProfiles = ref<UserProfile[]>(
    JSON.parse(localStorage.getItem("directMessages") || "[]")
  );

  const insertOrMoveUserProfile = (profile: UserProfile) => {
    const idx = userProfiles.value.findIndex(
      (_profile) => _profile.id === profile.id
    );

    const alreadyExists = idx !== -1;

    if (alreadyExists) {
      userProfiles.value.splice(idx, 1);
    }

    userProfiles.value.unshift(profile);
    localStorage.setItem("directMessages", JSON.stringify(userProfiles.value));
  };

  const deleteUserProfileById = (profileId: string) => {
    const idx = userProfiles.value.findIndex(
      (profile) => profile.id === profileId
    );
    if (idx !== -1) {
      userProfiles.value.splice(idx, 1);
      localStorage.setItem(
        "directMessages",
        JSON.stringify(userProfiles.value)
      );
    }
  };

  return {
    userProfiles,
    insertOrMoveUserProfile,
    deleteUserProfileById,
  };
});

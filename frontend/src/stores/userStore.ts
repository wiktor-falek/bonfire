import { ref } from "vue";
import { defineStore } from "pinia";
import type { UserProfile } from "../api/users";

export const useUserStore = defineStore("user", () => {
  const userProfile = ref<UserProfile>();

  const setUserProfile = (newUserProfile: UserProfile) => {
    userProfile.value = newUserProfile;
  };

  return { userProfile, setUserProfile };
});

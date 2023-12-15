import { defineStore } from "pinia";
import { ref } from "vue";
import { type UserProfile } from "../api/users/getCurrentProfile";

export const useUserStore = defineStore("userProfiles", () => {
  const userProfiles = ref<Map<string, UserProfile>>(new Map());

  const setUserProfile = (profile: UserProfile) => {
    userProfiles.value.set(profile.id, profile);
  };

  return { userProfiles };
})

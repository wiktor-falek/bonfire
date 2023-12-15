import { defineStore } from "pinia";
import { ref } from "vue";
import { type UserProfile } from "../api/users/getCurrentProfile";

export const useUserStore = defineStore("user", () => {
  const userProfile = ref<UserProfile>();

  const setUserProfile = (newUserProfile: UserProfile) => {
    userProfile.value = newUserProfile;
  };

  return { userProfile, setUserProfile };
});

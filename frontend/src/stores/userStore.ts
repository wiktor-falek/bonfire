import { defineStore } from "pinia";
import { ref } from "vue";
import { UserProfile } from "../api/users/getUserProfileById";

export const useUserStore = defineStore("user", () => {
  const userProfile = ref<UserProfile>();

  const setUserProfile = (newUserProfile: UserProfile) => {
    userProfile.value = newUserProfile;
  }

  return { userProfile, setUserProfile }
})

import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserProfile } from "../api/users";

export const useUserProfilesStore = defineStore("userProfiles", () => {
  // userId to UserProfile mapping
  const userProfiles = ref<Map<string, UserProfile>>(new Map());

  // channelId to UserProfile mapping
  const directMessageChannelProfiles = ref<Map<string, UserProfile>>(new Map());

  const setUserProfile = (profile: UserProfile) => {
    userProfiles.value.set(profile.id, profile);
  };

  const setUserProfiles = (profiles: UserProfile[]) => {
    for (const profile of profiles) {
      userProfiles.value.set(profile.id, profile);
    }
  };

  const setDirectMessageChannelProfiles = (
    channelId: string,
    profile: UserProfile
  ) => {
    directMessageChannelProfiles.value.set(channelId, profile);
  };

  return {
    userProfiles,
    directMessageChannelProfiles,
    setUserProfile,
    setUserProfiles,
    setDirectMessageChannelProfiles,
  };
});

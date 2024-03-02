import { defineStore } from "pinia";
import type { UserProfile } from "../api/users";
import socket, { socketEmitter } from "../socket";
import { ref } from "vue";

export const useUserProfilesStore = defineStore("userProfiles", () => {
  socketEmitter.on(
    "subscription:user-profile:status",
    ({ profileId, status }) => {
      const profile = userProfiles.value.get(profileId)?.profile;
      if (!profile) {
        return console.error("Tried to update subscribed profile, found none");
      }

      profile.status = status;
    }
  );

  // userId to profile data mapping
  const userProfiles = ref(
    new Map<string, { profile: UserProfile; invalidated?: boolean }>()
  );

  // channelId to profile data mapping
  const directMessageChannelProfiles = ref(
    new Map<string, { profile: UserProfile; invalidated?: boolean }>()
  );

  function _subscribeToProfilesChanges(profiles: UserProfile[]) {
    socket.send(
      JSON.stringify({
        type: "subscribe:user-profiles",
        data: { profileIds: profiles.map((p) => p.id) },
      })
    );
  }

  function _unsubscribeFromProfileChanges(profiles: UserProfile[]) {
    socket.send(
      JSON.stringify({
        type: "unsubscribe:user-profiles",
        data: { profileIds: profiles.map((p) => p.id) },
      })
    );
  }

  function getUserProfile(userId: string) {
    return userProfiles.value.get(userId)?.profile;
  }

  function setUserProfile(profile: UserProfile) {
    userProfiles.value.set(profile.id, { profile });
    _subscribeToProfilesChanges([profile]);
  }

  function setUserProfiles(profiles: UserProfile[]) {
    for (const profile of profiles) {
      userProfiles.value.set(profile.id, { profile });
    }
    _subscribeToProfilesChanges(profiles);
  }

  function getDirectMessageChannelProfile(channelId: string) {
    return directMessageChannelProfiles.value.get(channelId)?.profile;
  }

  function setDirectMessageChannelProfile(
    channelId: string,
    profile: UserProfile
  ) {
    directMessageChannelProfiles.value.set(channelId, { profile });
    _subscribeToProfilesChanges([profile]);
  }

  return {
    getUserProfile,
    setUserProfile,
    setUserProfiles,
    getDirectMessageChannelProfile,
    setDirectMessageChannelProfile,
  };
});

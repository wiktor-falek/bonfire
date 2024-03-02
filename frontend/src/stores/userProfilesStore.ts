import { defineStore } from "pinia";
import type { UserProfile } from "../api/users";
import socket, { socketEmitter } from "../socket";
import { ref, type Ref } from "vue";

export const useUserProfilesStore = defineStore("userProfiles", () => {
  socketEmitter.on(
    "subscription:user-profile:status",
    ({ profileId, status }) => {
      const profile = userProfiles.get(profileId)?.profile;
      if (!profile) {
        return console.error("Tried to update subscribed profile, found none");
      }

      profile.value.status = status;
    }
  );

  // userId to profile data mapping
  const userProfiles = new Map<
    string,
    { profile: Ref<UserProfile>; invalidated?: boolean }
  >();

  // channelId to profile data mapping
  const directMessageChannelProfiles = new Map<
    string,
    { profile: Ref<UserProfile>; invalidated?: boolean }
  >();

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
    return userProfiles.get(userId)?.profile;
  }

  function setUserProfile(profile: UserProfile) {
    userProfiles.set(profile.id, { profile: ref(profile) });
    _subscribeToProfilesChanges([profile]);
  }

  function setUserProfiles(profiles: UserProfile[]) {
    for (const profile of profiles) {
      userProfiles.set(profile.id, { profile: ref(profile) });
    }
    _subscribeToProfilesChanges(profiles);
  }

  function getDirectMessageChannelProfile(channelId: string) {
    return directMessageChannelProfiles.get(channelId)?.profile;
  }

  function setDirectMessageChannelProfile(
    channelId: string,
    profile: UserProfile
  ) {
    directMessageChannelProfiles.set(channelId, { profile: ref(profile) });
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

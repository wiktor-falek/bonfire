import { defineStore } from "pinia";
import type { UserProfile } from "../api/users";
import socket from "../socket";

export const useUserProfilesStore = defineStore("userProfiles", () => {
  // userId to UserProfile mapping
  const userProfiles = new Map<
    string,
    { profile: UserProfile; invalidated?: boolean }
  >();

  // channelId to UserProfile mapping
  const directMessageChannelProfiles = new Map<
    string,
    { profile: UserProfile; invalidated?: boolean }
  >();

  function _subscribeToProfilesChanges(profiles: UserProfile[]) {
    socket.send(
      JSON.stringify({
        type: "subscribe:user-profiles",
        data: profiles.map((p) => p.id),
      })
    );
  }

  function _unsubscribeFromProfileChanges(profiles: UserProfile[]) {
    socket.send(
      JSON.stringify({
        type: "unsubscribe:user-profiles",
        data: profiles.map((p) => p.id),
      })
    );
  }

  function getUserProfile(userId: string) {
    return userProfiles.get(userId)?.profile;
  }

  function setUserProfile(profile: UserProfile) {
    userProfiles.set(profile.id, { profile });
    _subscribeToProfilesChanges([profile]);
  }

  function setUserProfiles(profiles: UserProfile[]) {
    for (const profile of profiles) {
      userProfiles.set(profile.id, { profile });
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
    directMessageChannelProfiles.set(channelId, { profile });
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

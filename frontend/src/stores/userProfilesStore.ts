import { defineStore } from "pinia";
import type { UserProfile } from "../api/users";
import WebSocketClient from "../socket";
import { ref } from "vue";

/**
 * A central store that manages all user profiles displayed in direct messages,
 * friends list and server members. Adding a profile automatically creates a WebSocket
 * subscription, which handles updating the profile whenever the state changes.
 * Whenever a component that renders the profiles is unmounted, it should call
 * unsubscribeFromProfileChanges to avoid excesive network calls.
 */
export const useUserProfilesStore = defineStore("userProfiles", () => {
  const socket = WebSocketClient.getInstance();

  socket.on("subscription:user-profile:status", ({ profileId, status }) => {
    const profile = userProfiles.value.get(profileId)?.profile;
    if (!profile) {
      return console.error("Tried to update subscribed profile, found none");
    }

    profile.status = status;
  });

  // userId to profile data mapping
  const userProfiles = ref(
    new Map<string, { profile: UserProfile; invalidated?: boolean }>()
  );

  // channelId to profile data mapping
  const directMessageChannelProfiles = ref(
    new Map<string, { profile: UserProfile; invalidated?: boolean }>()
  );

  function _subscribeToProfilesChanges(profiles: UserProfile[]) {
    socket.emit("subscribe:user-profiles", {
      profileIds: profiles.map((p) => p.id),
    });
  }

  function unsubscribeFromProfileChanges(profiles: UserProfile[]) {
    socket.emit("unsubscribe:user-profiles", {
      profileIds: profiles.map((p) => p.id),
    });
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

  // TODO: does it make sense that it stores profile of the other user in dm?
  // look into finding a better solution
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
    unsubscribeFromProfileChanges,
  };
});

import { ref } from "vue";
import { defineStore } from "pinia";
import type { Relations } from "../api/relations";
import WebSocketClient from "../socket";

export const useRelationsStore = defineStore("relations", () => {
  const socket = WebSocketClient.getInstance();

  socket.on("relation:friend-invite", ({ profile }) => {
    console.log("received relation:friend-invite", profile);
    // TODO: Handle profile updates. Add to userProfilesStore and push reference? or some magical robust solution idk
    relations.value.pending.push(profile);
  });

  const relations = ref<Relations>({
    friends: [],
    pending: [],
    blocked: [],
  });

  const setRelations = (newRelations: Relations) => {
    relations.value = newRelations;
  };

  return { relations, setRelations };
});

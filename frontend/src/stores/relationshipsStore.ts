import { ref } from "vue";
import { defineStore } from "pinia";
import type { Relationships } from "../api/relationships";

export const useRelationshipsStore = defineStore("relationships", () => {
  const relationships = ref<Relationships>({
    friends: [],
    pending: [],
    blocked: [],
  });

  const setRelationships = (newRelationships: Relationships) => {
    relationships.value = newRelationships;
  };

  return { relationships, setRelationships };
});

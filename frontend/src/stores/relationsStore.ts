import { ref } from "vue";
import { defineStore } from "pinia";
import type { Relations } from "../api/relations";

export const useRelationsStore = defineStore("relations", () => {
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

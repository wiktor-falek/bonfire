import { defineStore } from "pinia";
import { Relationships } from "../api/relationships/getRelationships";
import { ref } from "vue";

const useRelationshipsStore = defineStore("relationships", () => {
  const relationships = ref<Relationships>({ friends: [], pending: [], blocked: [] });

  const setRelationships = (newRelationships: Relationships) => {
    console.log(relationships);
    relationships.value = newRelationships;
  }

  return { relationships, setRelationships }
})

export default useRelationshipsStore;
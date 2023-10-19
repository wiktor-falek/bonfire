import { defineStore } from "pinia";
import { ref } from "vue";

const useAppStore = defineStore("app", () => {
  const username = ref("TODO");
  const displayName = ref("TODO");

  return { username, displayName };
});

export default useAppStore;

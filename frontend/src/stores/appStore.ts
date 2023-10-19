import { defineStore } from "pinia";
import { ref } from "vue";

const useAppStore = defineStore("app", () => {
  const username = ref("apdo");
  const displayName = ref("Apdo");

  return { username, displayName /*sidePanelIsOpen*/ };
});

export default useAppStore;

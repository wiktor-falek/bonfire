import { defineStore } from "pinia";
import { ref } from "vue";

const useAppStore = defineStore("app", () => {
  const username = ref("apdo");
  const displayName = ref("Apdo");

  const sidePanelIsOpen = ref(false);

  return { username, displayName, sidePanelIsOpen };
});

export default useAppStore;

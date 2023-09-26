import { defineStore } from "pinia";
import { ref } from "vue";

const useAppStore = defineStore("app", () => {
  const sidePanelIsOpen = ref(false);

  return { sidePanelIsOpen };
});

export default useAppStore;

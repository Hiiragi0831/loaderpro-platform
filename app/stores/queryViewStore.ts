import { defineStore } from "pinia";

export const useQueryViewStore = defineStore("queryView", {
  state: () => ({
    activeView: "new-request",
  }),
  actions: {
    setActiveView(view: string) {
      this.activeView = view;
    },
  },
});

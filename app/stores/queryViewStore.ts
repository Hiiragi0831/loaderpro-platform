import { defineStore } from "pinia";

export const useQueryViewStore = defineStore("queryView", {
  state: () => ({
    activeView: "funnel",
  }),
  actions: {
    setActiveView(view: string) {
      this.activeView = view;
    },
  },
});

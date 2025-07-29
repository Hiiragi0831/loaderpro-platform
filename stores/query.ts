import { defineStore } from "pinia";

export const useQueryStore = defineStore("query", {
  state: () => ({
    query: JSON.parse(localStorage.getItem("query") || "[]"),
  }),
  actions: {
    add(item: object | object[]) {
      if (Array.isArray(item)) {
        const items = Array.isArray(item) ? item.flat() : [item];
        this.query.push(...items);
      } else {
        this.query.push(item);
      }
      localStorage.setItem("query", JSON.stringify(this.query));
    },
    remove(index: number) {
      this.query.splice(index, 1);
      localStorage.setItem("query", JSON.stringify(this.query));
    },
    clear() {
      this.query = [];
      localStorage.removeItem("query");
    },
  },
});

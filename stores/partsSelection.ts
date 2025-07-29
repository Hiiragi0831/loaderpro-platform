import { defineStore } from "pinia";

interface PartItem {
  id: number;
  title_parts: string;
  num_parts: string;
  count: number;
  comment?: string;
  image?: string;
}

export const usePartsSelectionStore = defineStore("partsSelection", {
  state: () => ({
    partsSelection: [] as PartItem[],
  }),
  actions: {
    add(item: PartItem | PartItem[]) {
      if (Array.isArray(item)) {
        const items = Array.isArray(item) ? item.flat() : [item];
        this.partsSelection.push(...items);
      } else {
        this.partsSelection.push(item);
      }
    },
    remove(index: number) {
      this.partsSelection.splice(index, 1);
    },
    clear() {
      this.partsSelection = [];
    },
  },
});

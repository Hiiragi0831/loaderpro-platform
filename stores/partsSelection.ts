import { defineStore } from 'pinia'

export const usePartsSelectionStore = defineStore('partsSelection', {
  state: () => ({
    partsSelection: JSON.parse(localStorage.getItem('partsSelection') || '[]'),
  }),
  actions: {
    add(item: object | object[]) {
      if (Array.isArray(item)) {
        const items = Array.isArray(item) ? item.flat() : [item]
        this.partsSelection.push(...items)
      } else {
        this.partsSelection.push(item)
      }
      localStorage.setItem('partsSelection', JSON.stringify(this.partsSelection))
    },
    remove(index: number) {
      this.partsSelection.splice(index, 1)
      localStorage.setItem('partsSelection', JSON.stringify(this.partsSelection))
    },
    clear() {
      this.partsSelection = []
      localStorage.removeItem('partsSelection')
    }
  }
})

import { defineStore } from 'pinia'

export const useQueryStore = defineStore('query', {
  state: () => ({
    query: [] as object[],
  }),
  actions: {
    loadQuery() {
      this.query = JSON.parse(localStorage.getItem('query') || '[]')
    },
    addQuery(item: object) {
      this.query.push(item)
      localStorage.setItem('query', JSON.stringify(this.query))
    },
    removeQuery(index: number) {
      this.query.splice(index, 1)
      localStorage.setItem('query', JSON.stringify(this.query))
    },
    clearQuery() {
      this.query = []
      localStorage.removeItem('query')
    }
  }
})

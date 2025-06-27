import { defineStore } from 'pinia'

export interface Brand {
  name: string
}

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brand: [] as Brand[],
    loaded: false,
  }),
  actions: {
    async getBrands() {
      if (this.loaded) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/brand`);
      this.brand = await res.json();
      localStorage.setItem('brand', JSON.stringify(this.brand))
      this.loaded = true;
    },
  }
})

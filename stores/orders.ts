import { defineStore } from 'pinia'
import type { OrderItem } from '~/types/orderType'


interface OrderHistoryParams {
  page: number
  limit: number
  sortBy?: string
  status_name?: string
}

interface OrderHistoryResponse {
  items: OrderItem[]
  meta: {
    total_items: number
  }
}

interface CacheEntry {
  data: OrderHistoryResponse
  timestamp: number
  params: OrderHistoryParams
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    cache: new Map<string, CacheEntry>(),
    loading: false,
    cacheTimeout: 5 * 60 * 1000, // 5 минут
  }),

  getters: {
    isLoading: (state) => state.loading,
  },

  actions: {
    generateCacheKey(params: OrderHistoryParams): string {
      return JSON.stringify(params)
    },

    isCacheValid(entry: CacheEntry): boolean {
      return Date.now() - entry.timestamp < this.cacheTimeout
    },

    async fetchOrderHistory(params: OrderHistoryParams): Promise<OrderHistoryResponse> {
      const cacheKey = this.generateCacheKey(params)
      const cachedEntry = this.cache.get(cacheKey)

      // Проверяем кэш
      if (cachedEntry && this.isCacheValid(cachedEntry)) {
        return cachedEntry.data
      }

      this.loading = true

      try {
        const urlParams = new URLSearchParams()
        urlParams.set('page', String(params.page))
        urlParams.set('limit', String(params.limit))

        if (params.sortBy) {
          urlParams.set('sortBy', params.sortBy)
        }

        if (params.status_name) {
          urlParams.set('status_name', params.status_name)
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders?${urlParams}`, {
          method: 'GET',
        })

        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }

        const result = await res.json()

        // Сохраняем в кэш
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          params,
        })

        return result
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.cache.clear()
    },

    invalidateCache(pattern?: Partial<OrderHistoryParams>) {
      if (!pattern) {
        this.clearCache()
        return
      }

      // Удаляем записи, которые соответствуют паттерну
      for (const [key, entry] of this.cache.entries()) {
        const shouldInvalidate = Object.entries(pattern).every(([paramKey, paramValue]) => {
          if (paramValue === undefined) return true
          return entry.params[paramKey as keyof OrderHistoryParams] === paramValue
        })

        if (shouldInvalidate) {
          this.cache.delete(key)
        }
      }
    },

  },
})

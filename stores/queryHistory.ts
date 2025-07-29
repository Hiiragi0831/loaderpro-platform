import { defineStore } from "pinia";
import type { QueryHistoryItem } from "~/types/queryType";

interface QueryHistoryParams {
  page: number;
  limit: number;
  sortBy?: string;
  status_name?: string;
}

interface QueryHistoryResponse {
  items: QueryHistoryItem[];
  meta: {
    total_items: number;
  };
}

interface CacheEntry {
  data: QueryHistoryResponse;
  timestamp: number;
  params: QueryHistoryParams;
}

export const useQueryHistoryStore = defineStore("queryHistory", {
  state: () => ({
    cache: new Map<string, CacheEntry>(),
    loading: false,
    cacheTimeout: 5 * 60 * 1000, // 5 минут
  }),

  getters: {
    isLoading: (state) => state.loading,
  },

  actions: {
    generateCacheKey(params: QueryHistoryParams): string {
      return JSON.stringify(params);
    },

    isCacheValid(entry: CacheEntry): boolean {
      return Date.now() - entry.timestamp < this.cacheTimeout;
    },

    async fetchQueryHistory(
      params: QueryHistoryParams,
    ): Promise<QueryHistoryResponse> {
      const cacheKey = this.generateCacheKey(params);
      const cachedEntry = this.cache.get(cacheKey);

      // Проверяем кэш
      if (cachedEntry && this.isCacheValid(cachedEntry)) {
        return cachedEntry.data;
      }

      this.loading = true;

      try {
        const urlParams = new URLSearchParams();
        urlParams.set("page", String(params.page));
        urlParams.set("limit", String(params.limit));

        if (params.sortBy) {
          urlParams.set("sortBy", params.sortBy);
        }

        if (params.status_name) {
          urlParams.set("status_name", params.status_name);
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/querys?${urlParams}`,
          {
            method: "GET",
          },
        );

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }

        const result = await res.json();

        // Сохраняем в кэш
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          params,
        });

        return result;
      } finally {
        this.loading = false;
      }
    },

    clearCache() {
      this.cache.clear();
    },

    invalidateCache(pattern?: Partial<QueryHistoryParams>) {
      if (!pattern) {
        this.clearCache();
        return;
      }

      // Удаляем записи, которые соответствуют паттерну
      for (const [key, entry] of this.cache.entries()) {
        const shouldInvalidate = Object.entries(pattern).every(
          ([paramKey, paramValue]) => {
            if (paramValue === undefined) return true;
            return (
              entry.params[paramKey as keyof QueryHistoryParams] === paramValue
            );
          },
        );

        if (shouldInvalidate) {
          this.cache.delete(key);
        }
      }
    },
  },
});

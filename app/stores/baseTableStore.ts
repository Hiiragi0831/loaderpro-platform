import {defineStore} from "pinia";
import {useApi} from "~/composables/useApi";

/**
 * Базовые параметры для запросов к API
 * Содержит обязательные поля для пагинации и позволяет расширение дополнительными параметрами
 */
export interface BaseParams {
  page: number; // Номер страницы для пагинации
  limit: number; // Количество элементов на странице
  [key: string]: any; // Дополнительные параметры (фильтры, сортировка и т.д.)
}

/**
 * Стандартный формат ответа от API с пагинацией
 * @template T - Тип элементов в массиве items
 */
export interface BaseResponse<T> {
  items: T[]; // Массив данных
  meta: {
    current_page: number;
    per_page: number;
    remaining_count: number;
    total_items: number;
    total_pages: number;
  };
}

/**
 * Фабричная функция для создания универсального store для работы с таблицами
 * Предоставляет функциональность кэширования, загрузки и обновления данных
 *
 * @template T - Тип элементов данных
 * @template P - Тип параметров запроса (расширяет BaseParams)
 * @param storeName - Уникальное имя store
 * @param endpoint - API endpoint для запросов
 * @param defaultParams - Параметры по умолчанию для всех запросов
 * @returns Настроенный Pinia store
 */
export function baseTableStore<T, P extends BaseParams>(
  storeName: string,
  endpoint: string,
  defaultParams: Partial<P> = {},
) {
  return defineStore(storeName, {
    state: () => ({
      cache: new Map(), // Кэш для хранения результатов запросов
      loading: false, // Флаг состояния загрузки данных
      updating: false, // Флаг состояния обновления данных
      cacheTimeout: 5 * 60 * 1000, // Время жизни кэша в миллисекундах (5 минут)
    }),

    getters: {
      /** Геттер для проверки состояния загрузки */
      isLoading: (state) => state.loading,
      /** Геттер для проверки состояния обновления */
      isUpdating: (state) => state.updating,
    },

    actions: {
      /**
       * Генерирует уникальный ключ для кэширования на основе параметров запроса
       * @param params - Параметры запроса
       * @returns Строковый ключ для кэша
       */
      generateCacheKey(params: P): string {
        return JSON.stringify(params);
      },

      /**
       * Проверяет, действителен ли кэшированный элемент
       * @param entry - Элемент кэша с временной меткой
       * @returns true, если кэш еще действителен
       */
      isCacheValid(entry: any): boolean {
        return Date.now() - entry.timestamp < this.cacheTimeout;
      },

      /**
       * Преобразует параметры в URLSearchParams для HTTP запроса
       * @param params - Параметры запроса
       * @returns Объект URLSearchParams для добавления к URL
       */
      buildUrlParams(params: P): URLSearchParams {
        const urlParams = new URLSearchParams();

        // Устанавливаем обязательные базовые параметры пагинации
        urlParams.set("page", String(params.page));
        urlParams.set("limit", String(params.limit));

        // Добавляем дополнительные параметры
        this.addCustomParams(urlParams, params);

        return urlParams;
      },

      /**
       * Добавляет кастомные параметры к URLSearchParams
       * Пропускает базовые параметры и пустые значения
       * @param urlParams - Объект URLSearchParams для модификации
       * @param params - Исходные параметры запроса
       */
      addCustomParams(urlParams: URLSearchParams, params: P): void {
        Object.entries(params).forEach(([key, value]) => {
          // Пропускаем базовые параметры, которые уже добавлены
          if (key === "page" || key === "limit") return;

          // Добавляем параметр, только если значение валидно
          if (this.isValidParamValue(value)) {
            urlParams.set(key, String(value));
          }
        });
      },

      /**
       * Проверяет, является ли значение параметра валидным для добавления в запрос
       * Исключает пустые строки, null, undefined и пустые массивы/объекты
       * @param value - Значение для проверки
       * @returns true, если значение можно использовать в запросе
       */
      isValidParamValue(value: any): boolean {
        // Проверяем на базовые "пустые" значения
        if (value === undefined || value === null || value === "") {
          return false;
        }

        // Для массивов проверяем, что они не пустые
        if (Array.isArray(value) && value.length === 0) {
          return false;
        }

        // Для объектов проверяем, что они не пустые
        if (typeof value === "object" && Object.keys(value).length === 0) {
          return false;
        }

        return true;
      },

      /**
       * Основной метод для получения данных с поддержкой кэширования
       * @param params - Параметры запроса
       * @returns Promise с данными в формате BaseResponse
       */
      async fetchData(params: P): Promise<BaseResponse<T>> {
        // Объединяем параметры по умолчанию с переданными
        const mergedParams = { ...defaultParams, ...params } as P;
        const cacheKey = this.generateCacheKey(mergedParams);
        const cachedEntry = this.cache.get(cacheKey);
        const token = JSON.parse(<string>localStorage.getItem("user")).token;

        // Возвращаем данные из кэша, если они актуальны
        if (cachedEntry && this.isCacheValid(cachedEntry)) {
          return cachedEntry.data;
        }

        this.loading = true;

        try {
          // Строим URL с параметрами
          const urlParams = this.buildUrlParams(mergedParams);
          const res = await fetch(`${useApi().apiUrl}/${endpoint}?${urlParams}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          // Обрабатываем ошибки HTTP
          if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
          }

          const result = await res.json();

          // Сохраняем результат в кэш с временной меткой
          this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
            params: mergedParams,
          });

          return result;
        } finally {
          // Обязательно сбрасываем флаг загрузки
          this.loading = false;
        }
      },

      /**
       * метод для получения всех данных по Id
       * @param paramsId - Параметры запроса
       * @returns Promise с данными в формате BaseResponse
       */
      async fetchDetails(paramsId: string | number) {
        const userStr = localStorage.getItem("user");

        if (!userStr) {
          // console.error("Пользователь не найден в localStorage");
          return;
        }

        const user = JSON.parse(userStr);
        try {
          const response = await fetch(`${useApi().apiUrl}/${endpoint}/${paramsId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          });
          return await response.json();
        } catch (error) {
          console.error("Ошибка загрузки детальных данных:", error);
          throw error;
        }
      },

      /**
       * Обновляет существующую запись через PATCH запрос
       * После успешного обновления инвалидирует весь кэш
       * @param id - Идентификатор записи для обновления
       * @param data - Данные для обновления
       * @returns Promise с обновленными данными
       */
      async updateData(id: number, data: any) {
        this.updating = true;

        try {
          const res = await fetch(`${useApi().apiUrl}/${endpoint}/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
          }

          const updatedData = await res.json();

          // Очищаем кэш, так как данные могли измениться
          this.invalidateCache();

          return updatedData;
        } finally {
          this.updating = false;
        }
      },

      /**
       * Полностью очищает кэш
       */
      clearCache() {
        this.cache.clear();
      },

      /**
       * Инвалидирует кэш по паттерну или полностью
       * @param pattern - Паттерн параметров для селективной инвалидации
       */
      invalidateCache(pattern?: Partial<P>) {
        // Если паттерн не указан, очищаем весь кэш
        if (!pattern) {
          this.clearCache();
          return;
        }

        // Удаляем только записи, соответствующие паттерну
        for (const [key, entry] of this.cache.entries()) {
          const shouldInvalidate = Object.entries(pattern).every(([paramKey, paramValue]) => {
            // Если значение паттерна undefined, считаем условие выполненным
            if (paramValue === undefined) return true;
            // Проверяем совпадение значения в кэшированных параметрах
            return entry.params[paramKey as keyof P] === paramValue;
          });

          if (shouldInvalidate) {
            this.cache.delete(key);
          }
        }
      },
    },
  });
}

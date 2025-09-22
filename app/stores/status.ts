import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export interface Status {
  orders: { value: number; label: string }[];
  querys: { value: number; label: string }[];
  products: { value: number; label: string }[];
}

export const useStatusStore = defineStore("status", {
  state: () => ({
    status: {} as Status,
    loaded: false,
  }),
  actions: {
    async getStatus() {
      // console.log("getStatus вызван, loaded:", this.loaded);

      if (this.loaded) {
        // console.log("Статусы уже загружены");
        return;
      }

      const storedStatus = localStorage.getItem("status");

      if (storedStatus) {
        try {
          this.status = JSON.parse(storedStatus);
          this.loaded = true;
          // console.log("Статусы загружены из localStorage:", this.brand.length);
          return;
        } catch (error) {
          console.error("Ошибка парсинга:", error);
        }
      }

      const userStr = localStorage.getItem("user");
      // console.log("Пользователь в localStorage:", !!userStr);

      if (!userStr) {
        // console.error("Пользователь не найден в localStorage");
        return;
      }

      const user = JSON.parse(userStr);
      // console.log("Загружаем статусы с сервера...");

      const res = await fetch(`${useApi().apiUrl}/status`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        this.status = await res.json();
        localStorage.setItem("status", JSON.stringify(this.status));
        this.loaded = true;
        // console.log("Статусы загружены с сервера:", this.status.length);
      } else {
        // console.error("Ошибка загрузки статусов:", res.status);
      }
    },
  },
});

import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      firstname: "",
      company: "",
      token: "",
      loginAt: "",
    },
    message: {
      type: "",
      title: "",
      text: "",
    } as { type: string; title: string; text: string } | null,
    loader: false as boolean,
    isAuthenticated: false as boolean,
  }),
  actions: {
    async signUp(email: string, password: string) {
      this.loader = true;
      this.message = null;
      const b64 = btoa(`${email}:${password}`);
      try {
        const res = await fetch(`${useApi().apiUrl}/auth`, {
          method: "GET",
          headers: { "Authorization": `Basic ${b64}` },
        });
        const data = await res.json();
        if (res.ok && data && data.token) {
          this.user = { ...data, token: data.token, loginAt: Date.now() };
          localStorage.setItem("user", JSON.stringify(this.user));
          await useBrandStore().getBrands();
          this.isAuthenticated = true;
          this.message = {
            type: "success",
            title: "Вы успешно вошли в аккаунт",
            text: "Здравствуйте, " + this.user.firstname + "!",
          };
          await useRouter().push({ name: "home" });
        } else if (res.status === 401) {
          this.message = {
            type: "error",
            title: "Ошибка",
            text: "Неверный логин или пароль",
          };
        } else if (data.message) {
          this.message = {
            type: "error",
            title: "Ошибка",
            text: String(data.message),
          };
        } else {
          this.message = {
            type: "error",
            title: "Ошибка авторизации",
            text: `код ${res.status}`,
          };
        }
      } catch {
        this.message = {
          type: "error",
          title: "Сетевая ошибка",
          text: " Попробуйте позже",
        };
      } finally {
        this.loader = false;
      }
    },
    async checkToken() {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        this.isAuthenticated = false;
        return;
      }
      const user = JSON.parse(userStr);
      const now = Date.now();
      const DAY_MS = 24 * 60 * 60 * 1000;
      if (!user.loginAt || now - user.loginAt > DAY_MS) {
        this.logout({
          type: "warn",
          title: "Сессия истекла",
          text: "Время сессии истекло. Пожалуйста, войдите снова",
        });
        return;
      }
      try {
        const res = await fetch(`${useApi().apiUrl}/auth_me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.ok) {
          this.user = user;
          this.isAuthenticated = true;
        } else {
          this.logout({
            type: "error",
            title: "Ошибка авторизации",
            text: "Ваша сессия недействительна. Пожалуйста, войдите снова",
          });
        }
      } catch {
        this.logout({
          type: "error",
          title: "Ошибка авторизации",
          text: "Ваша сессия недействительна. Пожалуйста, войдите снова",
        });
      }
    },
    logout(messageParams?: { type?: string; title?: string; text?: string }) {
      this.message = {
        type: messageParams?.type || "info",
        title: messageParams?.title || "Выход из системы",
        text: messageParams?.text || "Вы успешно вышли из аккаунта",
      };
      this.user = { firstname: "", token: "", loginAt: "", company: "" };
      this.isAuthenticated = false;
      useBrandStore().loaded = false;
      localStorage.clear();
    },
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "LOADERPRO",
      htmlAttrs: {
        lang: "ru",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
        {
          name: "description",
          content:
            "Предлагаем купить запчасти для вилочных погрузчиков и складской техники от лучших мировых производителей и поставщиков в Санкт-Петербурге с доставкой по всей России у компании СПЕЦМАШИНА",
        },
        { name: "theme-color", content: "#ffffff" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon/favicon-32x32.png",
          sizes: "32x32",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favicon/site.webmanifest" },
      ],
    },
  },
  nitro: {
    devProxy: {
      host: "localhost",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@primevue/nuxt-module", "@pinia/nuxt", "nuxt-swiper"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  primevue: {
    importTheme: { from: "~/themes/loaderpro.ts" },
    options:{
      locale: {
        startsWith: "Начинается с",
        contains: "Содержит",
        notContains: "Не содержит",
        endsWith: "Заканчивается на",
        equals: "Равно",
        notEquals: "Не равно",
        noFilter: "Нет фильтра",
        lt: "Меньше чем",
        lte: "Меньше или равно",
        gt: "Больше чем",
        gte: "Больше или равно",
        dateIs: "Дата равна",
        dateIsNot: "Дата не равна",
        dateBefore: "Дата до",
        dateAfter: "Дата после",
        clear: "Очистить",
        apply: "Применить",
        matchAll: "Сопоставить все",
        matchAny: "Сопоставить любое",
        addRule: "Добавить правило",
        removeRule: "Удалить правило",
        accept: "Да",
        reject: "Нет",
        choose: "Выбрать",
        upload: "Загрузить",
        cancel: "Отмена",
        completed: "Завершено",
        pending: "В ожидании",
        dayNames: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
        dayNamesShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        monthNames: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        chooseYear: "Выбрать год",
        chooseMonth: "Выбрать месяц",
        chooseDate: "Выбрать дату",
        prevDecade: "Предыдущее десятилетие",
        nextDecade: "Следующее десятилетие",
        prevYear: "Предыдущий год",
        nextYear: "Следующий год",
        prevMonth: "Предыдущий месяц",
        nextMonth: "Следующий месяц",
        prevHour: "Предыдущий час",
        nextHour: "Следующий час",
        prevMinute: "Предыдущая минута",
        nextMinute: "Следующая минута",
        prevSecond: "Предыдущая секунда",
        nextSecond: "Следующая секунда",
        am: "до полудня",
        pm: "после полудня",
        today: "Сегодня",
        weekHeader: "Нед",
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dateFormat: "dd.mm.yy",
        weak: "Простой",
        medium: "Средний",
        strong: "Сильный",
        passwordPrompt: "Введите пароль",
        emptyFilterMessage: "Результатов не найдено",
        emptyMessage: "Нет доступных опций",
        fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      },
    }
  },
  icon: {
    customCollections: [
      {
        prefix: "icons",
        dir: "./app/assets/icons",
      },
    ],
  },
  runtimeConfig: {
    // Приватные ключи (доступны только на сервере)
    // apiSecret: process.env.API_SECRET,

    // Публичные ключи (доступны на клиенте и сервере)
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
    },
  },
});

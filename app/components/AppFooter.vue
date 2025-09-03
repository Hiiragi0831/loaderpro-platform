<script setup lang="ts">
import IconLogo from "~/components/icons/IconLogo.vue";
import IconSocialTelegram from "~/components/icons/IconSocialTelegram.vue";
import IconSocialVk from "~/components/icons/IconSocialVk.vue";
import IconSocialRutube from "~/components/icons/IconSocialRutube.vue";
import IconSocialYoutube from "~/components/icons/IconSocialYoutube.vue";
import IconBank from "~/components/icons/IconBank.vue";
import IconCreditCard from "~/components/icons/IconCreditCard.vue";
</script>

<template>
  <footer class="mt-auto">
    <div class="bg-zinc-850 py-30">
      <div
        class="container m-auto grid grid-cols-5 gap-45 max-lg:grid-cols-2 max-lg:gap-30"
      >
        <div
          class="grid gap-16 max-lg:order-5 max-lg:col-span-2 max-lg:justify-items-center"
        >
          <IconLogo class="w-205 h-50 shrink-0 text-white" />
          <div class="flex gap-10">
            <a
              href="https://t.me/loaderpro"
              target="_blank"
              class="text-white w-24 h-24"
            >
              <IconSocialTelegram />
            </a>
            <a
              href="https://vk.com/loaderproru"
              target="_blank"
              class="text-white w-24 h-24"
            >
              <IconSocialVk />
            </a>
            <a
              href="https://www.youtube.com/@loaderpro"
              target="_blank"
              class="text-white w-24 h-24"
            >
              <IconSocialYoutube />
            </a>
            <a
              href="https://rutube.ru/channel/34721255/"
              target="_blank"
              class="text-white w-24 h-24"
            >
              <IconSocialRutube />
            </a>
          </div>
          <iframe
            src="https://yandex.ru/sprav/widget/rating-badge/64792251897?type=rating&amp;theme=dark"
            width="150"
            height="50"
          />
        </div>
        <div class="grid gap-16 text-white">
          <p class="font-semibold text-xl">Обслуживание клиентов</p>
          <NuxtLink to="/about">О компании</NuxtLink>
          <NuxtLink to="/payment-delivery">Оплата и доставка</NuxtLink>
          <NuxtLink to="/return">Условия возврата</NuxtLink>
          <NuxtLink to="/credentials">Реквизиты</NuxtLink>
        </div>
        <div class="grid gap-16 text-white">
          <p class="font-semibold text-xl">Мой аккаунт</p>
          <NuxtLink to="/query">Запросы</NuxtLink>
          <NuxtLink to="/order">Заказы</NuxtLink>
          <NuxtLink to="/user">Настройки</NuxtLink>
          <NuxtLink to="/privacy-policy">Конфиденциальность</NuxtLink>
        </div>
        <div class="flex flex-col gap-16 text-white">
          <p class="font-semibold text-xl">Способы оплаты</p>
          <div class="grid grid-cols-2 gap-20">
            <div class="flex gap-10">
              <IconBank class="w-26 h-26 text-primary-500" />
              <p class="text-md">
                Безнал <br />
                с&nbsp;НДС
              </p>
            </div>
            <div class="flex gap-10">
              <IconCreditCard class="w-26 h-26 text-primary-500" />
              <p class="text-md">
                Оплата <br />
                картой
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-16 text-white">
          <p class="font-semibold text-xl">Варианты доставки</p>
          <div class="flex gap-20">
            <a href="https://www.cdek.ru/" target="_blank" class="w-65 h-20">
              <picture>
                <source srcset="@/assets/images/logo-cdek.png" />
                <img
                  src="@/assets/images/logo-cdek.png"
                  alt=""
                  decoding="async"
                />
              </picture>
            </a>
            <a href="https://www.dellin.ru/" target="_blank" class="w-65 h-20">
              <picture>
                <source srcset="@/assets/images/logo-del.png" />
                <img
                  src="@/assets/images/logo-del.png"
                  alt=""
                  decoding="async"
                />
              </picture>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-zinc-950 py-15">
      <div class="container m-auto flex justify-center">
        <p class="text-white">Все права защищены. 2025</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>

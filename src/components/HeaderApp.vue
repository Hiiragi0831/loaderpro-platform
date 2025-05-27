<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
</script>

<template>
  <header>
    <div class="py-18 bg-gray-100">
      <div class="container m-auto flex justify-between">
        <div class="flex gap-40">
          <RouterLink to="/">Обслуживание клиентов</RouterLink>
          <RouterLink to="/">Свяжитесь с нами</RouterLink>
        </div>
        <div class="flex gap-20 items-center">
          <RouterLink to="/" class="flex">
            <OverlayBadge value="2" size="small" class="size-20">
              <i class="pi pi-bell" style="font-size: calc(20 * var(--width-multiplier))" />
            </OverlayBadge>
          </RouterLink>
          <RouterLink to="/" class="flex gap-10">
            <OverlayBadge value="2" size="small" class="size-20">
              <i
                class="pi pi-shopping-cart"
                style="font-size: calc(20 * var(--width-multiplier))"
              />
            </OverlayBadge>
            <div class="font-bold">0 ₽</div>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="py-25 bg-white">
      <div class="container m-auto flex justify-between items-center gap-40">
        <IconLogo class="w-200 h-44 shrink-0" />
        <div class="flex gap-20 items-center">
          <FloatLabel variant="on" class="w-1/4">
            <InputText id="on_label" />
            <label for="on_label">Бренд</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-1/4">
            <InputText id="on_label" />
            <label for="on_label">Номер запчасти</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-1/7">
            <InputNumber  id="on_label" />
            <label for="on_label">Количество</label>
          </FloatLabel>
          <Button label="Запросить" class="w-1/4"/>
        </div>
        <div class="flex gap-10 shrink-0">
          <div class="flex flex-col gap-10">
            <div class="flex gap-10 items-center">
              <i class="pi pi-user color-primary-500" />
              <p>Имя пользователя</p>
            </div>
            <div class="text-sm">35465756200 - telkhpro 000</div>
          </div>
          <i class="pi pi-chevron-down" />
        </div>
      </div>
    </div>
    <div class="bg-zinc-850">
      <div class="container m-auto flex justify-between">
        <div
          class="flex"
          v-for="(item, id) in [
            [
              { name: 'Подбор ЗЧ', url: '/' },
              { name: 'Каталог', url: '/' },
              { name: 'Гараж', url: '/' },
            ],
            [
              { name: 'Запросы', url: '/' },
              { name: 'Заказы', url: '/' },
              { name: 'Новости', url: '/' },
            ],
          ]"
          :key="id"
        >
          <RouterLink
            class="group p-22 flex items-center justify-center transition hover:bg-primary-500 text-white text-xl"
            v-for="(nav, navId) in item"
            :key="navId"
            :to="nav.url"
          >
            <span class="transition group-hover:opacity-0">{{ nav.name }}</span>
            <span
              class="transition font-bold opacity-0 absolute group-hover:scale-105 group-hover:opacity-100"
              >{{ nav.name }}</span
            >
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

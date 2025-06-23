<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import { computed, onMounted, reactive } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'

const brandStore = useBrandStore();
const formData = reactive({
  brand: null as { name: string } | null,
  numparts: '',
  count: 1,
})

const brands = computed(() => brandStore.brand)

</script>

<template>
  <header class="max-lg:hidden">
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
        <RouterLink to="/">
          <IconLogo class="w-200 h-44 shrink-0" />
        </RouterLink>
        <div class="flex gap-20 items-center">
          <FloatLabel variant="on" class="w-1/4">
            <Select
              inputId="brand"
              v-model="formData.brand"
              :options="brands"
              filter
              optionLabel="name"
              class="w-full"
              fluid
            />
            <label for="brand">Бренд</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-1/3">
            <InputText id="numparts" v-model="formData.numparts" />
            <label for="numparts">Номер запчасти</label>
          </FloatLabel>

          <FloatLabel variant="on" class="w-1/3">
            <InputNumber
              v-model="formData.count"
              inputId="count"
              buttonLayout="horizontal"
              showButtons
              class="w-full"
              suffix=" шт."
              :min="1"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="count">Количество</label>
          </FloatLabel>
          <Button label="Запросить" class="w-1/4" />
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

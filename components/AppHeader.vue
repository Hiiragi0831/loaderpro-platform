<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import { computed } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { useField, useForm } from 'vee-validate'
import { querySchema } from '@/schema/querySchema'

const brandStore = useBrandStore()
const userStore = useAuthStore()
const toast = useToast()

const brands = computed(() => brandStore.brand)
const menu = [
  [
    { name: 'Подбор ЗЧ', url: '/parts-selection' },
    { name: 'Каталог', url: '/home' },
    { name: 'Гараж', url: '/home' },
  ],
  [
    { name: 'Запросы', url: '/query' },
    { name: 'Заказы', url: '/orders' },
    { name: 'Новости', url: '/home' },
  ],
]

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: querySchema,
})

const { value: brand } = useField('brand')
const { value: numParts } = useField<string>('numParts')
const { value: count } = useField<number>('count')

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Заявка успешно отправлена!',
        life: 4000,
      })
      handleReset()
    } else {
      const error = await res.text()
      toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 4000 })
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: String(e), life: 4000 })
  }
  console.log(values)
})
</script>

<template>
  <header class="max-lg:hidden">
    <div class="py-18 bg-gray-100">
      <div class="container m-auto flex justify-between">
        <div class="flex gap-40">
          <NuxtLink to="/home">Обслуживание клиентов</NuxtLink>
          <NuxtLink to="/home">Свяжитесь с нами</NuxtLink>
        </div>
        <div class="flex gap-20 items-center">
          <NuxtLink to="/home" class="flex">
            <OverlayBadge value="2" size="small" class="size-20">
              <i class="pi pi-bell" style="font-size: calc(20 * var(--width-multiplier))" />
            </OverlayBadge>
          </NuxtLink>
          <NuxtLink to="/home" class="flex gap-10">
            <OverlayBadge value="2" size="small" class="size-20">
              <i
                class="pi pi-shopping-cart"
                style="font-size: calc(20 * var(--width-multiplier))"
              />
            </OverlayBadge>
            <div class="font-bold">0 ₽</div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="py-25 bg-white">
      <div class="container m-auto flex justify-between items-center gap-40">
        <NuxtLink to="/home">
          <IconLogo class="w-200 h-44 shrink-0" />
        </NuxtLink>
        <form class="flex gap-20 items-center h-40" @submit="onSubmit">
          <FloatLabel variant="on" class="w-200 h-full">
            <Select
              v-model="brand"
              label-id="brand"
              :options="brands"
              option-label="name"
              option-value="name"
              filter
              class="w-full h-full"
              fluid
              :invalid="!!errors?.brand"
            />
            <label for="brand">Бренд</label>
            <Message
              v-if="errors?.brand"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
              >{{ errors?.brand }}
            </Message>
          </FloatLabel>
          <FloatLabel variant="on" class="w-170 h-full">
            <InputText
              id="numParts"
              v-model="numParts"
              :invalid="!!errors?.numParts"
              class="h-full"
            />
            <Message
              v-if="errors?.numParts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.numParts }}
            </Message>
            <label for="numParts">Номер запчасти</label>
          </FloatLabel>

          <FloatLabel variant="on" class="w-220 h-full">
            <InputNumber
              v-model="count"
              input-id="count"
              button-layout="horizontal"
              show-buttons
              class="w-full h-full"
              suffix=" шт."
              :min="1"
              :invalid="!!errors?.count"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="count">Количество</label>
            <Message
              v-if="errors?.count"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.count }}
            </Message>
          </FloatLabel>
          <Button class="h-full" type="submit">Запросить</Button>
        </form>
        <div class="flex gap-10 shrink-0">
          <div class="flex flex-col gap-10">
            <div class="flex gap-10 items-center">
              <i class="pi pi-user color-primary-500" />
              <p>{{ userStore.user.name }}</p>
            </div>
            <div class="text-sm">{{ userStore.user.company }}</div>
          </div>
          <i class="pi pi-chevron-down" />
        </div>
      </div>
    </div>
    <div class="bg-zinc-850">
      <div class="container m-auto flex justify-between">
        <div v-for="(item, id) in menu" :key="id" class="flex">
          <NuxtLink
            v-for="(nav, navId) in item"
            :key="navId"
            class="group p-22 flex items-center justify-center transition hover:bg-primary-500 text-white text-xl"
            :to="nav.url"
          >
            <span class="transition group-hover:opacity-0">{{ nav.name }}</span>
            <span
              class="transition font-bold opacity-0 absolute group-hover:scale-105 group-hover:opacity-100"
              >{{ nav.name }}</span
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

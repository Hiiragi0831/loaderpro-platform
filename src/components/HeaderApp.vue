<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import { computed } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'
import { useField, useForm } from 'vee-validate'
import { querySchema } from '@/schema/querySchema.ts'

const brandStore = useBrandStore()

const brands = computed(() => brandStore.brand)

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: querySchema,
})

const { value: brand } = useField('brand')
const { value: numparts } = useField<string>('numparts')
const { value: count } = useField<number>('count')

const onSubmit = handleSubmit((values) => {
  console.log(values)
  handleReset()
})
</script>

<template>
  <header class="max-lg:hidden">
    <div class="py-18 bg-gray-100">
      <div class="container m-auto flex justify-between">
        <div class="flex gap-40">
          <RouterLink to="/home">Обслуживание клиентов</RouterLink>
          <RouterLink to="/home">Свяжитесь с нами</RouterLink>
        </div>
        <div class="flex gap-20 items-center">
          <RouterLink to="/home" class="flex">
            <OverlayBadge value="2" size="small" class="size-20">
              <i class="pi pi-bell" style="font-size: calc(20 * var(--width-multiplier))" />
            </OverlayBadge>
          </RouterLink>
          <RouterLink to="/home" class="flex gap-10">
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
        <RouterLink to="/home">
          <IconLogo class="w-200 h-44 shrink-0" />
        </RouterLink>
        <form class="flex gap-20 items-center" @submit="onSubmit">
          <FloatLabel variant="on" class="w-200">
            <Select
              label-id="brand"
              v-model="brand"
              :options="brands"
              optionLabel="name"
              optionValue="name"
              filter
              class="w-full"
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
          <FloatLabel variant="on" class="w-170">
            <InputText id="numparts" v-model="numparts" :invalid="!!errors?.numparts" />
            <Message
              v-if="errors?.numparts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.numparts }}
            </Message>
            <label for="numparts">Номер запчасти</label>
          </FloatLabel>

          <FloatLabel variant="on" class="w-200">
            <InputNumber
              v-model="count"
              inputId="count"
              buttonLayout="horizontal"
              showButtons
              class="w-full"
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
          <Button label="Запросить" class="w-160" type="submit" />
        </form>
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
              { name: 'Подбор ЗЧ', url: '/home' },
              { name: 'Каталог', url: '/home' },
              { name: 'Гараж', url: '/home' },
            ],
            [
              { name: 'Запросы', url: '/query' },
              { name: 'Заказы', url: '/home' },
              { name: 'Новости', url: '/home' },
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

<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default:
      "https://image.loaderpro.ru/products/images/20808/ff43c6c6bfe7ef9b04a8086120f49cae.png",
  },
  name: {
    type: String,
    default: "Название товара товара товара товара",
  },
  brand: {
    type: String,
    default: "Бренд",
  },
  article: {
    type: String,
    default: "123456789",
  },
  weight: {
    type: Number,
    default: 0,
  },
  measurement: {
    type: String,
    default: "шт.",
  },
  specs: {
    type: Array,
    default: () => [
      {
        property: "Единица измерения",
        value: "шт.",
      },
      {
        property: "Качество",
        value: "OEM",
      },
    ],
  },
  offers: {
    type: Array,
    default: () => [
      {
        id: 0,
        vendor: 123456,
        price: 2145,
        count: 10,
        timeDelivery: "В наличии",
        quality: "OEM",
        status: 1,
      },{
        id: 1,
        vendor: 22,
        price: 2345,
        count: 100,
        timeDelivery: "2-3 дня",
        quality: "Оригинал",
        status: 1,
      },
    ],
  },
});
const formatter = useFormatter();
const getSeverity = (status: string) => {
  switch (status) {
    case "В идентификации":
    case "В запросе":
    case "Срок уточняется":
      return "text-yellow-500";
    case "Нет предложений":
    case "Некорректный номер":
      return "text-red-500";
    default:
      return "text-green-500";
  }
};
</script>

<template>
  <main class="py-30">
    <section>
      <div class="container m-auto">
        <h1>{{ name }} {{ brand }} {{ article }}</h1>
        <div class="flex gap-30 mt-30">
          <div class="flex flex-col w-400 gap-10">
            <swiper-container :slides-per-view="1" thumbs-swiper=".mySwiper2">
              <swiper-slide
                ><img src="https://swiperjs.com/demos/images/nature-1.jpg"
              /></swiper-slide>
              <swiper-slide
                ><img src="https://swiperjs.com/demos/images/nature-2.jpg"
              /></swiper-slide>
              <swiper-slide
                ><img src="https://swiperjs.com/demos/images/nature-3.jpg"
              /></swiper-slide>
              <swiper-slide
                ><img src="https://swiperjs.com/demos/images/nature-4.jpg"
              /></swiper-slide>
              <swiper-slide
                ><img src="https://swiperjs.com/demos/images/nature-5.jpg"
              /></swiper-slide>
            </swiper-container>
            <swiper-container
              class="mySwiper2 h-90"
              space-between="10"
              :slides-per-view="4"
              :free-mode="true"
              :watch-slides-progress="true"
            >
              <swiper-slide>
                <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
              </swiper-slide>
              <swiper-slide>
                <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
              </swiper-slide>
              <swiper-slide>
                <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
              </swiper-slide>
              <swiper-slide>
                <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
              </swiper-slide>
              <swiper-slide>
                <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
              </swiper-slide>
            </swiper-container>
          </div>
          <div class="w-350">
            <DataTable :value="specs" striped-rows :show-headers="false">
              <Column field="property" header="Свойство" class="h-60"></Column>
              <Column field="value" header="Значение"></Column>
            </DataTable>
          </div>
          <div class="w-350 ms-auto">
            <div class="flex flex-col w-full gap-15 justify-end">
              <div
                class="shadow-lg rounded-2xl p-15 bg-white flex gap-30 items-center justify-between"
              >
                <div class="flex flex-col gap-10">
                  <p class="text-lg font-semibold">Самый быстрый (Оригинал)</p>
                  <p class="text-2xl font-bold">
                    {{ formatter.formatMoney(2345) }}
                  </p>
                  <div class="flex items-center gap-10">
                    <i class="pi pi-calendar-times" /> 29.09.2025
                  </div>
                </div>
                <div class="flex items-center justify-center">
                  <Button icon="pi pi-shopping-cart" size="large" />
                </div>
              </div>
              <div
                class="shadow-lg rounded-2xl p-15 bg-white flex gap-30 items-center justify-between"
              >
                <div class="flex flex-col gap-10">
                  <p class="text-lg font-semibold">Самый дешевый (OEM)</p>
                  <p class="text-2xl font-bold">
                    {{ formatter.formatMoney(2145) }}
                  </p>
                  <div class="flex items-center gap-10">
                    <i class="pi pi-calendar-times" /> 31.09.2025
                  </div>
                </div>
                <div class="flex items-center justify-center">
                  <Button icon="pi pi-shopping-cart" size="large" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-30 mt-30">
          <p class="text-2xl font-bold">Предложения поставщиков</p>
          <DataTable :value="offers">
            <Column field="vendor" header="Поставщик" class="w-auto" />
            <Column field="price" header="Цена" class="w-150">
              <template #body="{ data }">
                {{ formatter.formatMoney(data.price) }}
              </template>
            </Column>
            <Column field="count" header="Кол-во" class="w-100">
              <template #body="{ data }">
                {{ data.count }} {{ measurement }}
              </template>
            </Column>
            <Column field="quality" header="Качество" class="w-200" />
            <Column field="timeDelivery" header="Срок поставки" class="w-200">
              <template #body="{ data }">
                <span :class="getSeverity(data.timeDelivery)">
                  {{ data.timeDelivery }}
                </span>
              </template>
            </Column>
            <Column field="id" class="w-150 h-60">
              <template #body="slotProps">
                <div class="flex gap-5">
                  <InputNumber :default-value="1" show-buttons />
                  <Button
                    v-if="slotProps.data.status"
                    class="flex-shrink-0"
                    icon="pi pi-shopping-cart"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.mySwiper2 swiper-slide {
  opacity: 0.4;
}

.mySwiper2 swiper-slide img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.mySwiper2 .swiper-slide-thumb-active {
  opacity: 1;
}
</style>

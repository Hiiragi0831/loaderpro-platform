<script setup lang="ts">
import { computed, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { querySchema } from "~/schema/querySchema";
import { useApi } from "~/composables/useApi";

const queryStore = useQueryStore();
const brandStore = useBrandStore();
const queryHistoryStore = useQueryHistoryStore();
const toast = useToast();

const rowsPerPage = 10;
const first = ref(0);
const totalRecords = computed(() => queryStore.query.length);
const showPaginator = computed(() => totalRecords.value > rowsPerPage);

const brands = computed(() => brandStore.brand);

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: querySchema,
});

const { value: brand } = useField("brand");
const { value: num_parts } = useField<string>("num_parts");
const { value: count } = useField<number>("count");

const onSubmit = handleSubmit((values) => {
  queryStore.add({
    id: Math.round(Date.now() + Math.random()),
    brand: values.brand,
    num_parts: values.num_parts,
    count: values.count,
  });
  handleReset();
});

const handleSend = async () => {
  // Здесь можно добавить логику отправки запроса
  console.log("Отправка запроса:", JSON.stringify(queryStore.query));
  // Очистка запроса после отправки
  try {
    const res = await fetch(`${useApi().apiUrl}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(queryStore.query),
    });
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Заявка успешно отправлена!",
        life: 4000,
      });
      handleReset();
      queryHistoryStore.invalidateCache();
    } else {
      const error = await res.text();
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: error,
        life: 4000,
      });
    }
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: String(e),
      life: 4000,
    });
  }
  queryStore.clear();
};
</script>

<template>
  <section>
    <div class="container mx-auto flex flex-col gap-15">
      <div class="shadow-lg rounded bg-white">
        <div class="flex justify-between items-center p-25">
          <h3>Запрос цены</h3>
          <QueryLoadExcel />
        </div>
        <hr class="border-zinc-300" />
        <form
          class="grid grid-cols-4 items-center gap-15 p-25"
          @submit="onSubmit"
        >
          <FloatLabel variant="on" class="h-full">
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
          <FloatLabel variant="on" class="h-full">
            <InputText
              id="num_parts"
              v-model="num_parts"
              :invalid="!!errors?.num_parts"
              class="h-full"
            />
            <Message
              v-if="errors?.num_parts"
              severity="error"
              size="small"
              variant="simple"
              class="absolute"
            >
              {{ errors.num_parts }}
            </Message>
            <label for="num_parts">Номер запчасти</label>
          </FloatLabel>

          <FloatLabel variant="on" class="h-full">
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
          <Button type="submit" class="h-full">Добавить в запрос</Button>
        </form>
      </div>
      <div
        v-if="queryStore.query.length > 0"
        class="shadow-lg rounded bg-white"
      >
        <div class="flex justify-between items-center p-25">
          <h3>Ваш запрос</h3>
          <Button variant="outlined" @click="queryStore.clear()"
            >Очистить форму</Button
          >
        </div>
        <hr class="border-zinc-300" />
        <div class="p-25 flex flex-col gap-25">
          <DataTable
            :value="queryStore.query"
            show-gridlines
            :paginator="showPaginator"
            :rows="rowsPerPage"
            :first="first"
            :total-records="totalRecords"
            @update:first="(val) => (first = val)"
          >
            <Column field="brand" header="Бренд" class="w-1/4 !p-10" />
            <Column field="num_parts" header="Номер запчасти" class="!p-10" />
            <Column field="count" header="Количество" class="w-1/6 !p-10">
              <template #body="slotProps">
                {{ slotProps.data.count }} шт.
              </template>
            </Column>
            <Column header="Действия" class="w-24 !p-10">
              <template #body="slotProps">
                <div class="justify-center items-center flex">
                  <Button
                    icon="pi pi-times"
                    @click="queryStore.remove(slotProps.index)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
          <Button class="ml-auto" @click="handleSend">Отправить запрос</Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>

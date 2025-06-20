<script setup lang="ts">
const dataTable = [
  {
    title: 'Наименование контрагента',
    text: 'ООО «СПЕЦМАШИНА»',
  },
  {
    title: 'Юридический, фактический и почтовый адрес',
    text: '196240, г. Санкт-Петербург, ул. Кубинская, д. 75 к. 1 литера А, помещ. 3-Н, ком. 25 (Офис 216)',
  },
  {
    title: 'Телефон',
    text: '8 (800) 55-11-996',
  },
  {
    title: 'E-mail',
    text: 'buh@loaderpro.ru',
  },
  {
    title: "ИНН/КПП",
    text: '7810959038 / 781001001',
  },
  {
    title: 'ОГРН',
    text: '1227800152590',
  },
  {
    title: 'ОКВЭД',
    text: '45.32',
  },
  {
    title: 'ОКПО',
    text: '54144451',
  },
  {
    title: 'ОКАТО',
    text: '40284000',
  },
  {
    title: 'БАНК',
    text: 'в АО «Тинькофф Банк»',
  },
  {
    title: 'Р/С',
    text: '40702810710001237184',
  },
  {
    title: 'БИК',
    text: '044525974',
  },
  {
    title: 'К/С',
    text: '30101810145250000974',
  },
  {
    title: 'Генеральный директор',
    text: 'Сокирка Юлия Виталиевна - действующий на основании Устава',
  },

]
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-15">
      <h1>Реквизиты</h1>
      <DataTable :value="dataTable" showGridlines :showHeaders=false>
        <Column field="title"></Column>
        <Column field="text"></Column>
      </DataTable>
    </div>
  </main>
</template>

<style scoped>
table {
  td {
    @apply border border-indigo-500;
  }
}
</style>

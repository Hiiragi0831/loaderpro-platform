<script setup>
import {Form, useField, useForm} from "vee-validate";

const analytics = ref([]);
const { handleSubmit, errors, handleReset } = useForm();
const dillers = ref([
  { name: 'Дилер 1', id: 1 },
  { name: 'Дилер 2', id: 2 },
  { name: 'Дилер 3', id: 3 }
]);

async function fetchData() {
  const resp = await fetch('https://564f5f16b90cb3b1.mokky.dev/analytics');
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  analytics.value = data[0];
}

function discountPercent(value) {
  return Number(value) / 3 * 100;
}

const { value: dates } = useField('dates', {
  initialValue: [new Date(), new Date()],
  validate: () => true // убираем обязательность
});
const { value: selectedDiller } = useField('selectedDiller', {
  initialValue: '', // пустая строка по умолчанию
  validate: () => true // убираем обязательность
});

const onFormSubmit = handleSubmit((values) => {
  const now = new Date();
  const safeDates = (!values.dates || values.dates.length !== 2)
      ? [now, now]
      : values.dates;
  // Если дилер не выбран, отправить пустую строку
  const safeDiller = values.selectedDiller || '';

  console.log('Период:', safeDates);
  console.log('Дилер:', safeDiller);
  handleReset();
})

onMounted(fetchData);
</script>

<template>
  <main class="relative grid">
    <section class="achievements">
      <div class="container m-auto">
        <div class="achievements__row">
          <div class="achievement">
            <div class="achievement__status">
              <AnalyticProgressCircle :percent="discountPercent(analytics.discount)" />
              <picture>
                <source srcset="/images/home/tick-dynamic-premium.png">
                <img src="/images/home/tick-dynamic-premium.png" alt="" decoding="async">
              </picture>
            </div>
            <div class="achievement__info">
              <p class="achievement__title">Ваша скидка</p>
              <div class="achievement__text">
                <span :class="discountPercent(analytics.discount) === 100? 'is-active': ''">{{analytics.discount}}%</span>
                <p>
                  Активируется при достижении цели выручки в 3 млн. рублей.
                  <br>
                  <br>
                  Скидка растёт от количества суммы выкупа ваших товаров.
                </p>
              </div>
            </div>
          </div>
          <div class="achievement">
            <div class="achievement__status">
              <AnalyticProgressCircle :percent="analytics.delay" />
              <picture>
                <source srcset="/images/home/trophy-dynamic-premium.png">
                <img src="/images/home/trophy-dynamic-premium.png" alt="" decoding="async">
              </picture>
            </div>
            <div class="achievement__info">
              <p class="achievement__title">Отсрочка платежа</p>
              <div class="achievement__text">
                <span :class="analytics.delay === 100? 'is-active': ''">{{analytics.delay}}%</span>
                <p>Предоставляется при сумме заказов более 3 млн в течение более 3 месяцев.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="analytics">
      <div class="container m-auto">
        <Form class="filter" @submit="onFormSubmit">
          <FloatLabel variant="on">
            <DatePicker
                inputId="date"
                v-model="dates"
                selectionMode="range"
                :manualInput="false"
                showIcon
                iconDisplay="input"
                size="large"
                :pt="{
                  pcinputtext: {
                    root: {
                      style: {
                        fontSize: 'calc(14 * var(--width-multiplier))',
                      }
                    }
                  },
                }"
            />
            <label for="date">Выберите период</label>
          </FloatLabel>
          <Button
              type="submit"
              size="large"
              :pt="{
                root: {
                  style: {
                    fontSize: 'calc(14 * var(--width-multiplier))',
                  }
                }
              }"
          >
            Применить
          </Button>
        </Form>
        <div class="info">
          <h2>Данные по запросам:</h2>
          <h2>Данные по конверсии:</h2>
          <h2>Данные по заказам:</h2>
        </div>
        <div class="row">
          <div class="info" v-for="(group, groupIdx) in analytics.cards" :key="groupIdx">
            <template v-for="(item, idx) in group" :key="item.format + idx">
              <AnalyticCardInfo
                  v-if="item.format === 'card'"
                  :title="item.title"
                  :number="item.number"
                  :percentage="item.percentage"
              />
              <AnalyticCardSpeed
                  v-else-if="item.format === 'speed'"
                  :percentage="item.percentage"
              />
            </template>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.achievements {
  margin: calc(30 * var(--width-multiplier)) 0;
}
.achievements__row {
  display: grid;
  grid-template-columns: calc(580 * var(--width-multiplier)) calc(580 * var(--width-multiplier));
  justify-content: space-between;
}

.achievement {
  display: flex;
  padding: calc(15 * var(--width-multiplier));
  border: 1px solid #f79633;
  border-radius: calc(20 * var(--width-multiplier));
  gap: calc(40 * var(--width-multiplier));
}

.achievement__status {
  display: flex;
  align-items:  center;
  justify-content: center;
  flex-shrink: 0;
  width: calc(120 * var(--width-multiplier));
  height: calc(120 * var(--width-multiplier));
}

.achievement__status svg {
  position: absolute;
  width: calc(120 * var(--width-multiplier));
  height: calc(120 * var(--width-multiplier));
}

.achievement picture {
  width: calc(96 * var(--width-multiplier));
  height: calc(96 * var(--width-multiplier));
}

.achievement__title {
  font-weight: 500;
  text-transform: uppercase;
  font-size: calc(14 * var(--width-multiplier));
  line-height: calc(18 * var(--width-multiplier));
  color: #71717a;
}

.achievement__info {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: calc(16 * var(--width-multiplier));
}

.achievement__text {
  display: grid;
  grid-template-columns: 1fr calc(240 * var(--width-multiplier));
  justify-content: space-between;
  align-items: flex-end;
}

.achievement__text span {
  font-weight: 700;
  font-size: calc(60 * var(--width-multiplier));
  line-height: 1;
  color: #9f9f9f;
}
.achievement__text span.is-active {
  color: #f79633;
}
.achievement__text p {
  font-weight: 400;
  font-size:calc(12 * var(--width-multiplier));
  line-height: calc(14 * var(--width-multiplier));
  color: #9f9f9f;
}

.filter {
  display: flex;
  gap: calc(15 * var(--width-multiplier));
  align-items: center;
  margin-bottom: calc(30 * var(--width-multiplier));
}
.filter span {
  width: calc(200 * var(--width-multiplier));
}
.analytics {
  margin: calc(30 * var(--width-multiplier)) 0;
}
.row {
  display: flex;
  margin-top: calc(15 * var(--width-multiplier));
  flex-direction: column;
  gap: calc(40 * var(--width-multiplier));
}
.info {
  display: grid;
  grid-template-columns: calc(420 * var(--width-multiplier)) 1fr calc(420 * var(--width-multiplier));
  gap: calc(165 * var(--width-multiplier));
}

.info h2 {
  font-weight: 700;
  font-size: calc(18 * var(--width-multiplier));
  line-height: calc(24 * var(--width-multiplier));
  text-align: center;
  color: #18181B;
}

@media (max-width: 1024px) {
  .info {
    grid-template-columns: 100%;
    gap: calc(30 * var(--width-multiplier));
  }
  .filter {
    flex-direction: column;
  }
  .achievements__row {
    grid-template-columns: 100%;
    gap: calc(30 * var(--width-multiplier));
  }
}
</style>

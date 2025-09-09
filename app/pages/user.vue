<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { userSchema } from "~/schema/userShema";

const carrierOptions = [{ name: "Деловые линии" }, { name: "СДЭК" }];
const deliveryMethodOptions = [{ name: "До дверей" }, { name: "До терминала" }];
const priorityOptions = [{ name: "Укомплектовать полностью" }, { name: "Отправить имеющееся в наличии" }];

const initialValues = ref({});

const { errors, handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
});

const { value: firstname } = useField<string>("firstname");
const { value: lastname } = useField<string>("lastname");
const { value: position } = useField<string>("position");
const { value: phone } = useField<string>("phone");
const { value: inn } = useField<string>("inn");
const { value: company } = useField<string>("company");
const { value: actualAddress } = useField<string>("actualAddress");
const { value: legalAddress } = useField<string>("legalAddress");
const { value: postalAddress } = useField<string>("postalAddress");
const { value: emailNotifications } = useField<string>("emailNotifications");
const { value: deliveryCity } = useField<string>("deliveryCity");
const { value: deliveryAddress } = useField<string>("deliveryAddress");
const { value: carrier } = useField<string>("carrier");
const { value: shippingPriority } = useField<string>("shippingPriority");
const { value: deliveryMethod } = useField<string>("deliveryMethod");

const onSubmit = handleSubmit(async (values) => {
  try {
    console.log("Сохранение данных профиля:", values);
    // Здесь будет логика сохранения данных
    // await saveUserProfile(values);

    // Обновляем исходные значения после успешного сохранения
    initialValues.value = { ...values };

    // Показать уведомление об успешном сохранении
    // toast.add({ severity: 'success', summary: 'Успешно', detail: 'Настройки профиля сохранены' });
  } catch (error) {
    console.error("Ошибка при сохранении профиля:", error);
    // toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить настройки' });
  }
});

const handleCancel = () => {
  if (Object.keys(initialValues.value).length > 0) {
    // Восстанавливаем исходные значения
    resetForm({ values: initialValues.value });
  } else {
    // Если исходных значений нет, просто очищаем форму
    resetForm();
  }
};

// Загрузка данных профиля при монтировании компонента
onMounted(async () => {
  try {
    // Здесь будет логика загрузки данных пользователя
    // const userData = await getUserProfile();
    // resetForm({ values: userData });
    // initialValues.value = { ...userData };

    // Пример заполнения исходных значений для демонстрации
    const userData = {
      firstname: "",
      lastname: "",
      position: "",
      phone: "",
      inn: "",
      company: "",
      actualAddress: "",
      legalAddress: "",
      postalAddress: "",
      emailNotifications: "",
      deliveryCity: "",
      deliveryAddress: "",
      carrier: "",
      shippingPriority: "",
      deliveryMethod: "",
    };

    resetForm({ values: userData });
    initialValues.value = { ...userData };
  } catch (error) {
    console.error("Ошибка при загрузке данных профиля:", error);
  }
});
</script>

<template>
  <main class="py-30">
    <div class="container mx-auto flex flex-col gap-8">
      <h2 class="text-2xl font-bold">Настройки профиля</h2>

      <form class="flex flex-col gap-20" @submit="onSubmit">
        <!-- Основная информация -->
        <div class="bg-white p-15 rounded-2xl shadow-lg">
          <h3 class="text-xl font-semibold mb-6">Основная информация</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-15">
            <DefaultFormField
              id="firstname"
              v-model="firstname"
              :invalid="!!errors.firstname"
              :error="errors.firstname"
              label="Имя"
              type="text"
            />

            <DefaultFormField
              id="lastname"
              v-model="lastname"
              :invalid="!!errors.lastname"
              :error="errors.lastname"
              label="Фамилия"
              type="text"
            />

            <DefaultFormField
              id="position"
              v-model="position"
              :invalid="!!errors.position"
              :error="errors.position"
              label="Должность"
              type="text"
            />

            <DefaultFormField
              id="phone"
              v-model="phone"
              :invalid="!!errors.phone"
              :error="errors.phone"
              label="Телефон (WhatsApp, Telegram)"
              type="mask"
              mask="+7 (999) 999-99-99"
            />

            <DefaultFormField
              id="inn"
              v-model="inn"
              :invalid="!!errors.inn"
              :error="errors.inn"
              label="ИНН"
              type="mask"
              mask="999999999999"
            />

            <DefaultFormField
              id="company"
              v-model="company"
              :invalid="!!errors.company"
              :error="errors.company"
              label="Наименование компании"
              type="text"
            />
          </div>
        </div>

        <!-- Адреса -->
        <div class="bg-white p-15 rounded-2xl shadow-lg">
          <h3 class="text-xl font-semibold mb-15">Адреса</h3>
          <div class="grid grid-cols-1 gap-15">
            <DefaultFormField
              id="actualAddress"
              v-model="actualAddress"
              :invalid="!!errors.actualAddress"
              :error="errors.actualAddress"
              label="Фактический Адрес"
              type="text"
            />

            <DefaultFormField
              id="legalAddress"
              v-model="legalAddress"
              :invalid="!!errors.legalAddress"
              :error="errors.legalAddress"
              label="Юридический Адрес"
              type="text"
            />

            <DefaultFormField
              id="postalAddress"
              v-model="postalAddress"
              :invalid="!!errors.postalAddress"
              :error="errors.postalAddress"
              label="Почтовый Адрес"
              type="text"
            />
          </div>
        </div>

        <!-- Настройки уведомлений -->
        <div class="bg-white p-15 rounded-2xl shadow-lg">
          <h3 class="text-xl font-semibold mb-15">Уведомления</h3>
          <DefaultFormField
            id="emailNotifications"
            v-model="emailNotifications"
            :invalid="!!errors.emailNotifications"
            :error="errors.emailNotifications"
            label="Уведомление по электронной почте"
            type="text"
          />
        </div>

        <!-- Настройки для заказов -->
        <div class="bg-white p-15 rounded-2xl shadow-lg">
          <h3 class="text-xl font-semibold mb-15">Мои настройки для заказов</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-15">
            <DefaultFormField
              id="deliveryCity"
              v-model="deliveryCity"
              :invalid="!!errors.deliveryCity"
              :error="errors.deliveryCity"
              label="Город доставки"
              type="text"
            />

            <DefaultFormField
              id="deliveryAddress"
              v-model="deliveryAddress"
              :invalid="!!errors.deliveryAddress"
              :error="errors.deliveryAddress"
              label="Адрес доставки"
              type="text"
            />

            <DefaultFormField
              id="carrier"
              v-model="carrier"
              :invalid="!!errors.carrier"
              :error="errors.carrier"
              label="Перевозчик"
              type="select"
              :options="carrierOptions"
            />

            <DefaultFormField
              id="shippingPriority"
              v-model="shippingPriority"
              :invalid="!!errors.shippingPriority"
              :error="errors.shippingPriority"
              label="Приоритет отгрузки"
              type="select"
              :options="priorityOptions"
            />

            <div class="md:col-span-2">
              <DefaultFormField
                id="deliveryMethod"
                v-model="deliveryMethod"
                :invalid="!!errors.deliveryMethod"
                :error="errors.deliveryMethod"
                label="Метод доставки"
                type="select"
                :options="deliveryMethodOptions"
              />
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex gap-15 justify-end">
          <Button
            type="button"
            severity="secondary"
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            Отменить
          </Button>
          <Button type="submit" :loading="isSubmitting">
            Сохранить изменения
          </Button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useField, useForm } from "vee-validate";
import { loginSchema } from "@/schema/loginSchema";
import { ref } from "vue";
import { useRouter } from "vue-router";
import IconLogo from "@/components/icons/IconLogo.vue";
import MiniFooter from "~/components/MiniFooter.vue";

definePageMeta({
  layout: "empty",
});

const authStore = useAuthStore();
const visible = ref(false);

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  await authStore.signUp(values.email, values.password);
  handleReset();
});
</script>

<template>
  <div class="wrapper">
    <main class="relative grid pt-60">
      <section>
        <div class="container m-auto">
          <IconLogo class="w-527 h-113 max-lg:w-231 max-lg:h-50" />
          <p class="text-3xl font-bold mt-24 mb-40">LOADER PROTECTION</p>
          <div
            class="grid grid-cols-[1fr_auto_1fr] gap-130 max-lg:grid-cols-1 max-lg:gap-30"
          >
            <div class="flex flex-col gap-20">
              <p class="text-2xl text-primary-500 font-bold">
                Уже зарегистрированы?
              </p>
              <p class="text-2xl font-bold">Выполнить вход</p>
              <form class="flex flex-col gap-20" @submit="onSubmit">
                <FloatLabel variant="on">
                  <InputText
                    id="email"
                    v-model="email"
                    name="email"
                    :invalid="!!errors?.email"
                  />
                  <Message
                    v-if="errors?.email"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="absolute"
                  >
                    {{ errors.email }}
                  </Message>
                  <label for="email">Email</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <Password
                    id="password"
                    v-model="password"
                    name="password"
                    fluid
                    :invalid="!!errors?.password"
                    :feedback="false"
                  />
                  <Message
                    v-if="errors?.password"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="absolute"
                  >
                    {{ errors.password }}
                  </Message>
                  <label for="email">Пароль</label>
                </FloatLabel>
                <div class="flex gap-40">
                  <Button
                    label="Авторизоваться"
                    type="submit"
                    class="w-auto"
                    :loading="authStore.loader ?? undefined"
                  />
                  <Button label="Забыли пароль?" variant="text" />
                </div>
              </form>
              <Button
                label="Презентация платформы"
                variant="outlined"
                fluid
                class="mt-auto"
                @click="visible = true"
              />
              <Dialog
                v-model:visible="visible"
                modal
                header="Презентация платформы"
                class="w-1080"
              >
                <video
                  poster="@/assets/images/main/platform-preview.jpg"
                  controls
                >
                  <source
                    src="@/assets/images/main/platform-presentation.mp4"
                    type="video/mp4"
                  />
                </video>
              </Dialog>
            </div>
            <div class="w-full">
              <Divider layout="vertical" class="!flex max-lg:!hidden"
                ><b>ИЛИ</b></Divider
              >
              <Divider
                layout="horizontal"
                class="!hidden max-lg:!flex"
                align="center"
                ><b>ИЛИ</b></Divider
              >
            </div>
            <div class="flex flex-col gap-20">
              <p class="text-2xl text-primary-500 font-bold">
                Новый пользователь?
              </p>
              <p class="text-2xl font-bold">Зарегистрируйтесь здесь</p>
              <ul class="list-image">
                <li>Ничего лишнего в новом облике с привычным функционалом.</li>
                <li>Запросы на подбор по каталогу или номеру детали.</li>
                <li>
                  Возможность добавить технику в гараж для простоты запроса.
                </li>
                <li>
                  1616 брендов в портфеле, 25 000 тысяч товаров в наличии на
                  складах в России.
                </li>
                <li>Оригиналы и аналоги, 3 надежных канала поставок</li>
              </ul>
              <Button label="Зарегистрироваться" />
            </div>
          </div>
        </div>
      </section>
    </main>
    <MiniFooter />
  </div>
</template>

<style lang="scss" scoped>
.list-image {
  display: flex;
  flex-direction: column;
  gap: calc(14 * var(--width-multiplier));

  li {
    display: flex;
    align-items: center;
    gap: calc(14 * var(--width-multiplier));

    &::before {
      content: "";
      flex: none;
      width: calc(23 * var(--width-multiplier));
      height: calc(23 * var(--width-multiplier));
      background-image: url("data:image/svg+xml,%3Csvg width='23' height='23' viewBox='0 0 23 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.9125 10.7125C8.4625 10.2625 7.7875 10.2625 7.3375 10.7125C6.8875 11.1625 6.8875 11.8375 7.3375 12.2875L10.7125 15.6625C10.9375 15.8875 11.1625 16 11.5 16C11.8375 16 12.0625 15.8875 12.2875 15.6625L20.1625 6.6625C20.5 6.1 20.5 5.425 19.9375 5.0875C19.4875 4.75 18.8125 4.75 18.475 5.2L11.5 13.1875L8.9125 10.7125Z' fill='%2302BC7D'/%3E%3Cpath d='M21.625 10.375C20.95 10.375 20.5 10.825 20.5 11.5C20.5 16.45 16.45 20.5 11.5 20.5C6.55 20.5 2.5 16.45 2.5 11.5C2.5 9.1375 3.4 6.8875 5.0875 5.2C6.775 3.4 9.025 2.5 11.5 2.5C12.175 2.5 12.9625 2.6125 13.6375 2.725C14.2 2.95 14.875 2.6125 15.1 1.9375C15.325 1.2625 14.875 0.8125 14.3125 0.5875H14.2C13.3 0.3625 12.4 0.25 11.5 0.25C5.3125 0.25 0.25 5.3125 0.25 11.6125C0.25 14.5375 1.4875 17.4625 3.5125 19.4875C5.65 21.625 8.4625 22.75 11.3875 22.75C17.575 22.75 22.6375 17.6875 22.6375 11.5C22.75 10.825 22.1875 10.375 21.625 10.375Z' fill='%2302BC7D'/%3E%3C/svg%3E%0A");
      background-size: 100%;
      background-repeat: no-repeat;

      @media (max-width: 1024px) {
        margin: auto;
      }
    }
  }
}
</style>

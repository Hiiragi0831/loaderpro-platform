<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useField, useForm } from 'vee-validate'
import { loginSchema } from '@/schema/loginSchema.ts'

import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const { handleSubmit, errors, handleReset } = useForm({
  validationSchema: loginSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  await authStore.signUp(values.email, values.password)
  if (authStore.isAuthenticated) {
    await router.push('/home')
  }
  handleReset()
})
</script>

<template>
  <main class="relative grid">
    <section>
      <div class="container m-auto">
        <p>Авторизация</p>
        <form class="w-500 mx-auto flex flex-col gap-20" @submit="onSubmit">
          <FloatLabel variant="on">
            <InputText id="email" v-model="email" :invalid="!!errors?.email" />
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
            <Password id="password" v-model="password" fluid :invalid="!!errors?.password" :feedback="false"/>
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
          <Button
            label="Войти"
            type="submit"
            class="w-full"
            :loading="authStore.loader ?? undefined"
          />

        </form>
      </div>
    </section>
  </main>
</template>

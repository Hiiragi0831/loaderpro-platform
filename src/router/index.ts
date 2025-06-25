import { createRouter, createWebHistory, type Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () =>  import('../views/MainView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/payment-delivery',
      name: 'payment-delivery',
      component: () => import('../views/PaymentView.vue'),
    },
    {
      path: '/return',
      name: 'return',
      component: () => import('../views/ReturnView.vue'),
    },
    {
      path: '/credentials',
      name: 'credentials',
      component: () => import('../views/CredentialsView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/query',
      name: 'query',
      component: () => import('../views/QueryView.vue'),
    },
  ],
})

const publicRoutes = ['login', 'query', 'about', 'payment-delivery', 'return', 'credentials', 'privacy-policy']

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.checkToken()

  // Если маршрут не является публичным и пользователь не аутентифицирован, перенаправляем на логин
  if (!publicRoutes.includes(to.name as string) && !authStore.isAuthenticated) {
    return next({ path: '/login' })
  }

  next()
})

export default router

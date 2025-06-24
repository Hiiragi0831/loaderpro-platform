import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'registration',
      component: () =>  import('../views/RegistrationView.vue'),
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

export default router

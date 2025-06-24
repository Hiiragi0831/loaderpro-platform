import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import {definePreset} from "@primeuix/themes";
import { ToastService } from 'primevue'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastService);

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#FEE9CF',
      100: '#FDE0BB',
      200: '#FCCF94',
      300: '#FABD6C',
      400: '#F9AB45',
      500: '#F8991D',
      600: '#D67C07',
      700: '#A05D05',
      800: '#693D03',
      900: '#331E02',
      950: '#180E01'
    }
  },
  pt: {
    badge: {
      root: 'w-10',
    }
  }
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset
  }
});

app.mount('#app');

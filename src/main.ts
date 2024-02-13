import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css'
import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import UUID from "vue3-uuid";
import {createPinia} from 'pinia'

const app = createApp(App);
app.use(PrimeVue, { ripple: true  });
app.use(UUID);
app.use(createPinia())
app.mount('#app')

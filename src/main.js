import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore';
import router from './router'
import { Analytics } from "@vercel/analytics/next"

import App from './App.vue'


const app = createApp(App)

app.use(createPinia())
app.use(Analytics)

app.use(router)
app.mount('#app')

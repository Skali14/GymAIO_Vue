import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore';
import router from './router'

import App from './App.vue'


const app = createApp(App)

app.use(createPinia())
const auth = useAuthStore();
if (auth.token) {
  await auth.fetchUser();
  console.log("fetchuser after refresh")
}

app.use(router)
app.mount('#app')
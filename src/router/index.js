import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'
import CalorieView from '@/views/CalorieView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/calorietracker',
      name: 'calorietracker',
      component: CalorieView,
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: ExerciseView,
    },
    {
      path: '/',
      name: 'exercises2',
      component: ExerciseView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router

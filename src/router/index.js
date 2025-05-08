import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'
import CalorieView from '@/views/CalorieView.vue'

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
  ],
})

export default router

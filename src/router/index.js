import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'
import CalorieView from '@/views/CalorieView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import PlannerView from '@/views/PlannerView.vue'

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
      path: '/planner',
      name: 'planner',
      component: PlannerView,
    },
    {
      path: '/',
      name: 'login1',
      component: ExerciseView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'SignUpView',
      component: SignUpView,
    },

  ],
})

export default router

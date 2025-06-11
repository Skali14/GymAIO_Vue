import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'
import CalorieView from '@/views/CalorieView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import PlannerView from '@/views/PlannerView.vue'
import { useAuthStore } from '@/stores/authStore';
import TrackerView from '@/views/TrackerView.vue'
import UserDashboardView from '@/views/UserDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/calorietracker',
      name: 'calorietracker',
      component: CalorieView,
      meta: { requiresAuth: true }
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: ExerciseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/planner',
      name: 'planner',
      component: PlannerView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: TrackerView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'login1',
      component: LoginView,
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
    {
      path: '/dashboard',
      name: 'UserDashboard',
      component: UserDashboardView,
      meta: { requiresAuth: true }
    },

  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Ensure the store is initialized before making the auth check
  if (auth.token && !auth.isAuthenticated) {
    await auth.fetchUser();
  }

    // Redirect from "/" to dashboard if user is authenticated
  if (to.path === '/' && auth.isAuthenticated) {
    next('/dashboard');
    return;
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router

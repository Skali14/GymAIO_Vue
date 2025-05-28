<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-md mx-auto">
      <!-- Login Card -->
      <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <!-- Header with Icon -->
        <div class="text-center mb-8">
          <div class="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome to GymAIO</h2>
          <p class="text-gray-600">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              v-model="loginForm.email"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="loginForm.password"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="loginForm.rememberMe"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full p-3 bg-blue-600 text-white font-bold rounded-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-4 text-sm text-gray-500">or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?

            <RouterLink to="/signup" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Sign up here
            </RouterLink>
          </p>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          By signing in, you agree to our
          <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">Terms of Service</a>
          and
          <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import apiClient from '@/api/apiClient';  // import the configured axios instance
import router from '@/router/index';

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''
      this.isLoading = true

      try {
        // Basic validation
        if (!this.loginForm.email || !this.loginForm.password) {
          throw new Error('Please fill in all required fields')
        }

        // Simulate API call - replace with your actual authentication logic
        await this.login()
        
        // Handle successful login - redirect to dashboard/main app
        router.push({ name: 'calorietracker' });
        
      } catch (error) {
        this.errorMessage = error.message || 'Login failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    async login() {
      const response = await apiClient.post('/api/login', { email: this.loginForm.email, password: this.loginForm.password });
      const token = response.data.token;
      localStorage.setItem('token', token); // store token after login
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped>
/* Additional animations for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
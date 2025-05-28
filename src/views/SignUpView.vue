<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-md mx-auto">
      <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="bg-green-100 text-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p class="text-gray-600">Join GymAIO today</p>
        </div>

        <!-- Sign-up Form -->
        <form @submit.prevent="handleSignUp">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label for="firstName" class="block text-sm font-bold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                v-model="signUpForm.firstName"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-bold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                v-model="signUpForm.lastName"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              v-model="signUpForm.email"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="john.doe@example.com"
            />
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="signUpForm.password"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all pr-12"
                placeholder="Create a strong password"
              />
              <button type="button" @click="togglePasswordVisibility" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <!-- Password visibility icons -->
              </button>
            </div>
            <!-- Password strength indicator -->
            <div class="mt-2">
              <div class="flex space-x-1">
                <div :class="['h-1 flex-1 rounded', passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200']"></div>
                <div :class="['h-1 flex-1 rounded', passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200']"></div>
                <div :class="['h-1 flex-1 rounded', passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200']"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-bold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              v-model="signUpForm.confirmPassword"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="Confirm your password"
            />
            <p v-if="signUpForm.confirmPassword && !passwordsMatch" class="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          </div>

          <!-- Terms Agreement -->
          <div class="mb-6">
            <label class="flex items-start">
              <input
                type="checkbox"
                v-model="signUpForm.agreeToTerms"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <span class="ml-2 text-sm text-gray-600">
                I agree to the 
                <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">Terms of Service</a>
                and 
                <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">Privacy Policy</a>
              </span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Sign Up Button -->
          <button
            type="submit"
            :disabled="isLoading || !formIsValid"
            class="w-full p-3 bg-blue-600 text-white font-bold rounded-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Sign In Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Sign in here
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'SignUpView',
  data() {
    return {
      signUpForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      },
      showPassword: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  computed: {
    passwordsMatch() {
      return this.signUpForm.password === this.signUpForm.confirmPassword
    },
    passwordStrength() {
      const password = this.signUpForm.password
      let strength = 0
      if (password.length >= 8) strength++
      if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
      if (/\d/.test(password) && /[!@#$%^&*]/.test(password)) strength++
      return strength
    },
    passwordStrengthText() {
      const texts = ['Weak', 'Fair', 'Good', 'Strong']
      return texts[this.passwordStrength] || 'Very Weak'
    },
    formIsValid() {
      if (this.signUpForm.password && this.passwordStrength < 2) {
        this.errorMessage = "Password is too weak!"
      }
      return this.signUpForm.firstName &&
             this.signUpForm.lastName &&
             this.signUpForm.email &&
             this.signUpForm.password &&
             this.passwordsMatch &&
             this.signUpForm.agreeToTerms &&
             this.passwordStrength >= 2
    }
  },
  methods: {
    async handleSignUp() {
      this.errorMessage = ''
      this.isLoading = true

      try {
        // Validate form
        if (!this.formIsValid) {
          throw new Error('Please fill in all required fields correctly')
        }

        // Call your API
        await this.createAccount()
        
        // Success - redirect to login or dashboard
        this.$router.push('/login?message=Account created successfully')
        
      } catch (error) {
        this.errorMessage = error.message || 'Account creation failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    async createAccount() {
      // Replace with your actual API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate account creation
          resolve({ success: true })
        }, 2000)
      })
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>
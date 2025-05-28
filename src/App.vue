<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const headerTitle = computed(() => {
  switch (route.name) {
    case 'exercises':
      return 'Exercise Management'
    case 'planner':
      return 'Training Planner'
    case 'calorietracker':
      return 'Calorie Tracker'
    default:
      return 'Welcome to GymAIO'
  }
})

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function checkScroll() {
  isScrolled.value = window.scrollY > 20
}

// Watch for route changes and scroll to top smoothly
watch(() => route.path, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <!-- Main App Container -->
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
    <!-- Header -->
    <header
      :class="[
        'transition-all duration-300 w-full z-10',
        isScrolled ? 'sticky top-0 shadow-md bg-white bg-opacity-95 backdrop-blur-sm' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Header Content -->
        <div class="flex flex-col md:flex-row items-center justify-between">
          <!-- Logo and Title -->
          <div class="flex items-center mb-4 md:mb-0">
            <img
              src="/header_img.webp"
              alt="GymAIO Logo"
              class="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <h1
              :class="[
                'ml-4 text-2xl md:text-3xl font-bold transition-colors',
                isScrolled ? 'text-blue-600' : 'text-white'
              ]"
            >
              {{ headerTitle }}
            </h1>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              aria-label="Open menu"
              class="flex items-center px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              :class="[
                isScrolled ? 'text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-blue-700'
              ]"
              @click="toggleMobileMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="ml-2">Menu</span>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:block">
            <ul class="flex items-center flex-wrap space-x-0.5">
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-700'
                  ]"
                  active-class="bg-blue-700 text-white"
                >Exercise Management</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/planner"
                  :class="[
                    'px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-700'
                  ]"
                  active-class="bg-blue-700 text-white"
                >Training Planner</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-700'
                  ]"
                  active-class="bg-blue-700 text-white"
                >Training Tracker</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/calorietracker"
                  :class="[
                    'px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-700'
                  ]"
                  active-class="bg-blue-700 text-white"
                >Calorie Tracker</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-700'
                  ]"
                  active-class="bg-blue-700 text-white"
                >Admin Dashboard</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/login"
                  :class="[
                    'px-3 py-1.5 rounded-md text-sm font-medium border-2 transition-all duration-200 ml-1 whitespace-nowrap',
                    isScrolled
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-blue-600'
                  ]"
                >Login</RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Mobile Navigation -->
        <div
          :class="[
            'md:hidden transition-all duration-300 overflow-hidden',
            mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          ]"
        >
          <nav class="rounded-lg shadow-lg overflow-hidden" :class="isScrolled ? 'bg-white' : 'bg-blue-700'">
            <ul class="divide-y" :class="isScrolled ? 'divide-gray-200' : 'divide-blue-600'">
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'block px-4 py-3 font-medium transition-colors',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Exercise Management</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'block px-4 py-3 font-medium transition-colors',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Training Planner</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'block px-4 py-3 font-medium transition-colors',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Training Tracker</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/calorietracker"
                  :class="[
                    'block px-4 py-3 font-medium transition-colors',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Calorie Tracker</RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/exercises"
                  :class="[
                    'block px-4 py-3 font-medium transition-colors',
                    isScrolled ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' : 'text-white hover:bg-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Admin Dashboard</RouterLink>
              </li>
              <li class="p-4">
                <RouterLink
                  to="/exercises"
                  :class="[
                    'block px-4 py-2 rounded-md font-medium text-center border-2 transition-all duration-200',
                    isScrolled
                      ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-blue-600'
                  ]"
                  @click="mobileMenuOpen = false"
                >Login</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center">
            <img
              src="/header_img.webp"
              alt="GymAIO Logo"
              class="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
            <p class="ml-3 font-medium">GymAIO - {{ headerTitle }}</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
        <div class="mt-6 border-t border-gray-700 pt-6 text-sm text-center md:text-left text-gray-400">
          <p>&copy; 2025 - Michael Pittlik and Simon Kadlec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>

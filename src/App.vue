<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const headerTitle = computed(() => {
  switch (route.name) {
    case 'exercises':
      return 'Exercise Management'
    case 'calorietracker':
      return 'Calorie Tracker'
    default:
      return 'Welcome'
  }
})
</script>

<template>
  <header class="bg-custom-header md:p-5 text-center w-full mx-auto p-4">
    <div class="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto">
      <img
        src="/header_img.webp"
        alt="Exercise Dashboard Header Image"
        class="w-[150px] md:w-[220px] h-auto rounded-lg mb-3 md:mb-0 md:mr-5"
      />
      <h1
        class="m-0 text-3xl md:text-5xl font-semibold text-custom-title bg-custom-titlebg p-3 md:p-5 rounded-lg flex-grow text-center shadow-sm flex items-center justify-center h-[80px] md:h-[120px] w-full md:w-auto"
      >
        {{ headerTitle }}
      </h1>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden flex justify-center mt-4">
      <button
        id="mobile-menu-button"
        class="bg-custom-nav px-4 py-2 rounded-md"
        @click="toggleMobileMenu"
      >
        <span>Menu ☰</span>
      </button>
    </div>

    <nav
      id="nav-menu"
      :class="[
        'bg-custom-nav p-4 text-center w-full mt-5',
        mobileMenuOpen ? 'block' : 'hidden',
        'md:block',
      ]"
    >
      <ul class="list-none p-0 m-0 flex flex-col md:flex-row md:justify-center">
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/exercises"
            class="no-underline text-[#333] font-bold py-1 px-2.5 rounded transition-all duration-300 ease-in-out hover:text-black hover:bg-[#ddd] focus:bg-[#999] focus:text-white focus:font-bold focus:shadow block md:inline"
            >Exercise Management</RouterLink
          >
        </li>
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/exercises"
            class="no-underline text-[#333] font-bold py-1 px-2.5 rounded transition-all duration-300 ease-in-out hover:text-black hover:bg-[#ddd] focus:bg-[#999] focus:text-white focus:font-bold focus:shadow block md:inline"
            >Training Planner</RouterLink
          >
        </li>
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/exercises"
            class="no-underline text-[#333] font-bold py-1 px-2.5 rounded transition-all duration-300 ease-in-out hover:text-black hover:bg-[#ddd] focus:bg-[#999] focus:text-white focus:font-bold focus:shadow block md:inline"
            >Training Tracker</RouterLink
          >
        </li>
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/calorietracker"
            class="no-underline text-[#333] font-bold py-1 px-2.5 rounded transition-all duration-300 ease-in-out hover:text-black hover:bg-[#ddd] focus:bg-[#999] focus:text-white focus:font-bold focus:shadow block md:inline"
            >Calorie Tracker</RouterLink
          >
        </li>
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/exercises"
            class="no-underline text-[#333] font-bold py-1 px-2.5 rounded transition-all duration-300 ease-in-out hover:text-black hover:bg-[#ddd] focus:bg-[#999] focus:text-white focus:font-bold focus:shadow block md:inline"
            >Admin Dashboard</RouterLink
          >
        </li>
        <li class="mx-4 my-2 md:my-0">
          <RouterLink
            to="/exercises"
            class="no-underline text-[#333] font-bold py-1.5 px-3.5 rounded-md border-2 border-[#777] bg-transparent transition-all duration-300 hover:bg-[#ddd] hover:-translate-y-0.5 hover:shadow focus:bg-[#ccc] focus:translate-y-0 block md:inline"
            >Login</RouterLink
          >
        </li>
      </ul>
    </nav>
  </header>
  <div>
    <RouterView />
  </div>
  <div class="bg-[#f4f4f4] text-[#333] font-sans m-0 p-0 flex flex-col items-center">
    <footer class="bg-custom-footer p-4 text-center rounded-lg mx-auto my-5 shadow">
      <p class="my-1 text-custom-footertext font-bold">GymAIO - Exercise Management</p>
      <p class="my-1 text-custom-footertext font-bold">
        &copy; 2025 - Michael Pittlik and Simon Kadlec
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      mobileMenuOpen: false,
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
  },
  mounted() {
    console.log('MainPage mounted!')
  },
}
</script>

<style scoped></style>

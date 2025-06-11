
<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Main Content Container -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left: Input Form Section -->
        <div class="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            Add Meal
          </h2>
          <MealForm
            v-model="currentMeal"
            :is-editing="isEditing"
            @submit-meal="handleFormSubmit"
            @cancel-edit="cancelEdit"
          />
        </div>

        <!-- Right: Goals and Progress Section -->
        <section class="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span class="bg-green-100 text-green-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Daily Goals
          </h2>

          <!-- Goal Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Loop through the goals and display -->
            <div 
              v-for="(goalValue, goalType) in goal" 
              :key="goalType" 
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-lg font-semibold capitalize">{{ goalType }}</span>
                <div class="inline-flex gap-2 items-center">
                  <button
                    @click.prevent="startEditGoal(goalType, goal[goalType])"
                    v-if="editingGoalType !== goalType"
                    class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    aria-label="Edit goal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    @click.prevent="saveGoal(goalType)"
                    v-if="editingGoalType === goalType"
                    class="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition-colors"
                    aria-label="Save goal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    @click.prevent="cancelEditGoal"
                    v-if="editingGoalType === goalType"
                    class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Cancel edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    @click.prevent="deleteGoal(goalType)"
                    class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Delete goal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between mb-3">
                <div v-if="editingGoalType === goalType" class="flex items-center">
                  <input
                    type="number"
                    v-model.number="editingGoalValue"
                    min="0"
                    class="w-24 p-2 border border-blue-300 rounded-md text-base text-center focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div v-else class="text-2xl font-bold text-blue-600">{{ goal[goalType] }}</div>
                <span class="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Target</span>
              </div>

              <div class="flex items-center justify-between mb-3">
                <div class="text-xl font-medium">{{ mealStore[`current${capitalize(goalType)}`] }}</div>
                <span class="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Current</span>
              </div>

              <!-- Progress bar for each goal -->
              <ProgressBar :current="mealStore[`current${capitalize(goalType)}`]" :toReach="goal[goalType]" />
            </div>
          </div>
        </section>
      </div>

      <!-- Today's Meals Section -->
      <section class="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <span class="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          Today's Meals
        </h2>
        <MealTable
          :meals="mealStore.todaysMeals"
          @edit-meal="(meal) => startEdit(meal)"
          @meal-deleted="(id) => handleMealDeleted(id)"
        />
      </section>
    </div>
  </main>
</template>

<script>
  import MealForm from '@/components/MealForm.vue';
  import MealTable from '@/components/MealTable.vue';
  import { mapStores } from 'pinia';
  import { useMealStore, createEmptyMeal } from '@/stores/mealStore.js';
  import ProgressBar from '@/components/ProgressBar.vue';
  import apiClient from '@/api/apiClient';  // import the configured axios instance

  export default {
    name: 'CalorieView',
    components: { MealForm, MealTable, ProgressBar },
    data() {
      return {
        goal: {},
        editingGoalType: null,
        editingGoalValue: 0,
        currentMeal: createEmptyMeal(),
        isEditing: false,
      };
    },
    computed: {
      ...mapStores(useMealStore),
    },
    methods: {
      handleFormSubmit() {
        if (this.isEditing) {
          this.mealStore.updateMeal({ ...this.currentMeal });
        } else {
          this.mealStore.addMeal({ ...this.currentMeal });
        }
        this.resetForm();
      },
      startEdit(mealToEdit) {
        this.currentMeal = { ...mealToEdit };
        this.isEditing = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      cancelEdit() {
        this.resetForm();
      },
      handleMealDeleted(deletedMealId) {
        if (this.isEditing && this.currentMeal.id === deletedMealId) {
          this.resetForm();
        }
      },
      resetForm() {
        this.currentMeal = createEmptyMeal();
        this.isEditing = false;
      },
      startEditGoal(type, value) {
        this.editingGoalType = type;
        this.editingGoalValue = value;
      },
      async saveGoal(type) {
        if (this.editingGoalValue < 0) {
          alert('Goal value cannot be negative.');
          return;
        }
        try {
          const response = await apiClient.put('/api/goals', {
            goalType: type,
            value: this.editingGoalValue
          });
          this.goal[type] = this.editingGoalValue;
          this.editingGoalType = null;
          this.editingGoalValue = 0;
        } catch (error) {
          this.handleApiError(error, "Failed to update goal")
        }
      },
      cancelEditGoal() {
        this.editingGoalType = null;
        this.editingGoalValue = 0;
      },

      async deleteGoal(type) {
        if (confirm(`Are you sure you want to delete the ${type} goal?`)) {
          try {
            const response = await apiClient.put('/api/goals', {
              goalType: type,
              value: 0
            });
            this.goal[type] = 0;
          } catch (error) {
            this.handleApiError(error, "Failed to delete goal")
          }
        }
      },
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      async getAllGoals() {
        try {
          const response = await apiClient.get("/api/goals/")
          this.goal = response.data.goals
        } catch (error) {
          this.handleApiError(error, "Failed to get goals")
        }
      },
          // Centralized error handler for API calls
      handleApiError(error, contextMessage = 'An API error occurred') {
        console.error(contextMessage, error); // Log the full error for debugging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.latestErrorMessage = error.response.data;
        } else if (error.request) {
          // The request was made but no response was received
          this.latestErrorMessage = 'No response from server. Please check your network connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          this.latestErrorMessage = error.message || 'Error setting up the request.';
        }
    },

    },
    mounted() {
      console.log('CalorieView mounted')
      this.mealStore.getAllMeals()
      this.getAllGoals()
    },
  };
</script>

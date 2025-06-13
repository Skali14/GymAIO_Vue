<template>
          <section v-if="meals.length > 0" class="bg-white p-6 my-5 mx-auto rounded-xl shadow-md max-w-3xl">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Name</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Calories</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Proteins</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Carbohydrates</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Fats</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Vegetarian</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Manage</th>
                  </tr>
                </thead>

        <tbody>
          <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200" v-for="meal in meals" :key="meal._id">
            <td class="p-3 border-b border-gray-300 text-center">{{ meal.name }}</td>
            <td class="p-3 border-b border-gray-300 text-center">{{ meal.calories }}</td>
            <td class="p-3 border-b border-gray-300 text-center">{{ meal.proteins }}</td>
            <td class="p-3 border-b border-gray-300 text-center">{{ meal.carbohydrates }}</td>
            <td class="p-3 border-b border-gray-300 text-center">{{ meal.fats }}</td>
            <td class="p-3 border-b border-gray-300 text-center">
              {{ meal.vegetarian ? 'Yes' : 'No' }}
            </td>
            <td class="p-3 border-b border-gray-300 text-center">
              <div class="inline-flex justify-center gap-2 items-center">

                <button
                  @click.prevent="requestEdit(meal)"
                  title="Edit meal"
                  class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>

                <button
                  @click.prevent="handleDelete(meal._id, meal.name)"
                  title="Delete meal"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div v-if="meals.length === 0" class="text-center py-8 text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.459M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <p>You have not submitted any meals today.</p>
  </div>
</template>

<script>
// Import mapStores
import { mapStores } from 'pinia'
import { useMealStore } from '@/stores/mealStore.js'

export default {
  name: 'MealTable',
  props: {
    meals: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['edit-meal', 'meal-deleted'],
  computed: {
    // Map the store here as well to access its actions
    ...mapStores(useMealStore),
  },
  methods: {
    // No need for mapActions mapping anymore

    requestEdit(meal) {
      this.$emit('edit-meal', meal)
    },

    handleDelete(mealId, mealName) {
      if (confirm(`Are you sure you want to delete "${mealName}"?`)) {
        // Call the action via the mapped store object
        this.mealStore.deleteMeal(mealId)
        // Emit event AFTER calling the action to notify parent
        this.$emit('meal-deleted', mealId)
      }
    },
  },
}
</script>

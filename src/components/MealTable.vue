<template>
          <section class="bg-white p-6 my-5 mx-auto rounded-xl shadow-md max-w-3xl">
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
          <tr class="hover:bg-gray-200" v-for="meal in meals" :key="meal._id">
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
                <a href="#edit" @click.prevent="requestEdit(meal)"
                  ><img src="/edit.svg" alt="Modify" width="16" height="16"
                /></a>
                <a href="#delete" @click.prevent="handleDelete(meal._id, meal.name)"
                  ><img src="/trash.svg" alt="Delete" width="16" height="16"
                /></a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
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

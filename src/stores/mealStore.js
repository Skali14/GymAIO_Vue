import { defineStore } from 'pinia'

  // Initial meal data structure helper
export function createEmptyMeal() {
      return {
          id: null, // Important: null for new, set during edit
          name: '',
          calories: 0,
          proteins: 0,
          carbohydrates: 0,
          fats: 0,
          vegetarian: false
      };
  }

export const useMealStore = defineStore('meal', {
      // State: Contains the raw data
  state: () => ({
        meals: [
        // Some initial example data
        { id: Date.now() + 1, name: 'Spaghetti Bolognese', calories: 800, proteins: 16, carbohydrates: 52, fats: 9, vegetarian: false },
        { id: Date.now() + 2, name: 'Skyr (500g)', calories: 310, proteins: 55, carbohydrates: 20, fats: 2, vegetarian: true },
        ],
  }),

    getters: {
    currentCalories: (state) => {
        return state.meals.reduce((total, meal) => total + (Number(meal.calories) || 0), 0);
    },
    currentProteins: (state) => {
        return state.meals.reduce((total, meal) => total + (Number(meal.proteins) || 0), 0);
    },
    currentCarbohydrates: (state) => {
        return state.meals.reduce((total, meal) => total + (Number(meal.carbohydrates) || 0), 0);
    },
    currentFats: (state) => {
        return state.meals.reduce((total, meal) => total + (Number(meal.fats) || 0), 0);
    },
    mealCount: (state) => state.meals.length,
    allMeals: (state) => state.meals,
    },


    // Actions: Methods to modify the state
  actions: {
    // Action to add a new dish
    addMeal(mealData) {
      // Ensure it's a copy and assign a new ID
      const newMeal = {
        ...mealData, // Use data passed from the form
        id: Date.now(), // Generate unique ID in the action
      }
      this.meals.push(newMeal) // Mutate state directly within actions
      console.log('MealStore: Added meal -', newMeal.name)
    },

    // Action to update an existing dish
    updateMeal(updatedMealData) {
      const index = this.meals.findIndex((meals) => meals.id === updatedMealData.id)
      if (index !== -1) {
        // Replace the item at the found index with the updated data
        this.meals.splice(index, 1, { ...updatedMealData }) // Use a copy
        console.log('MealStore: Updated meal -', updatedMealData.name)
      } else {
        console.warn('DishStore: Dish not found for update - ID:', updatedMealData.id)
      }
    },

    // Action to delete a dish by its ID
    deleteMeal(mealId) {
      const initialLength = this.meals.length
      // Filter the array, keeping only dishes that DON'T match the ID
      this.meals = this.meals.filter((meal) => meal.id !== mealId)

      if (this.meals.length < initialLength) {
        console.log('MealStore: Deleted meal - ID:', mealId)
      } else {
        console.warn('MealStore: Meal not found for deletion - ID:', mealId)
      }
    },
  },
  })
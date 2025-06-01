import { defineStore } from 'pinia'
import { useAuthStore } from './authStore';
import apiClient from '@/api/apiClient';  // import the configured axios instance

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
        meals: [],
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
    async getAllMeals() {
      try {
        const response = await apiClient.get('/api/meals');
        this.meals = response.data.meals;
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch meals');
      }
    },

    // Action to add a new dish
    async addMeal(mealData) {
      try {
        const response = await apiClient.post('/api/meals', mealData);
      // Add the newly created dish (with ID from server) to the local array
        this.meals.push(response.data);
      console.log('Added new meal:', response.data.name);
      } catch (error) {
        this.handleApiError(error, `Failed to add meal`);
      }
    },

    // Action to update an existing dish
    async updateMeal(updatedMealData) {
      try {
        // Update existing meal
        const response = await apiClient.put(`/api/meals/${updatedMealData.id}`, updatedMealData);
        // Update the local array with the response from the server

        const index = this.meals.findIndex((meals) => meals.id === updatedMealData.id)
        if (index !== -1) {
          // Replace the item at the found index with the updated data
          this.meals.splice(index, 1, { ...updatedMealData }) // Use a copy
          console.log('MealStore: Updated meal -', updatedMealData.name)
        } else {
          console.warn('Mealstore: Meal not found for update - ID:', updatedMealData.id)
        }
      } catch (error) {
        this.handleApiError(error, `Failed to update Meal`);
      }
    },

    // Action to delete a dish by its ID
    async deleteMeal(mealId) {
      try {
        await apiClient.delete(`/api/meals/${mealId}`);
        // Filter the array, keeping only dishes that DON'T match the ID
        this.meals = this.meals.filter((meal) => meal.id !== mealId)
        console.log('Deleted meal ID:', mealId);
      } catch (error) {
        this.handleApiError(error, "Failed to delete meal")
      }
    },

    handleApiError(error, contextMessage = 'An API error occurred') {
      console.error(contextMessage, error); // Log the full error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            this.latestErrorMessage = '400 Bad Request: ' + error.response.data.message;
            break;
          case 401:
            this.latestErrorMessage = '401 Unauthorized: ' + error.response.data.message;
            break;
          case 403:
            this.latestErrorMessage = '403 Forbidden: ' + error.response.data.message;
            break;
          case 404:
            this.latestErrorMessage = '404 Not Found: ' + error.response.data.message;
            break;
          default:
            this.latestErrorMessage = 'An error occurred: ' + error.response.data.message;
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.latestErrorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        this.latestErrorMessage = error.message || 'Error setting up the request.';
      }
    },
  },
  })

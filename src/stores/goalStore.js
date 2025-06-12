import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'

export const useGoalStore = defineStore('goal', {
  // State: Contains the raw data
  state: () => ({
    goals: {
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0
    }
  }),

  getters: {
    // Get specific goal values
    calorieGoal: (state) => state.goals.calories || 0,
    proteinGoal: (state) => state.goals.proteins || 0,
    carbsGoal: (state) => state.goals.carbohydrates || 0,
    fatsGoal: (state) => state.goals.fats || 0,
    
    // Get all goals as an object
    allGoals: (state) => state.goals,
    
    // Check if goals are set (any goal > 0)
    hasGoalsSet: (state) => {
      return Object.values(state.goals).some(value => value > 0)
    }
  },

  // Actions: Methods to modify the state
  actions: {
    async getAllGoals() {
      try {
        const response = await apiClient.get('/api/goals/')
        this.goals = response.data.goals
        console.log('GoalStore: Fetched all goals:', this.goals)
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch goals')
      }
    },

    async updateGoal(goalType, value) {
      try {
        const response = await apiClient.put('/api/goals', {
          goalType: goalType,
          value: value
        })
        
        // Update local state
        this.goals[goalType] = value
        console.log(`GoalStore: Updated ${goalType} goal to ${value}`)
        
        return response.data
      } catch (error) {
        this.handleApiError(error, `Failed to update ${goalType} goal`)
        throw error // Re-throw so components can handle it
      }
    },

    async deleteGoal(goalType) {
      try {
        const response = await apiClient.put('/api/goals', {
          goalType: goalType,
          value: 0
        })
        
        // Update local state
        this.goals[goalType] = 0
        console.log(`GoalStore: Deleted ${goalType} goal`)
        
        return response.data
      } catch (error) {
        this.handleApiError(error, `Failed to delete ${goalType} goal`)
        throw error // Re-throw so components can handle it
      }
    },

    // Set multiple goals at once
    async setGoals(goalsObject) {
      try {
        const promises = Object.entries(goalsObject).map(([type, value]) => 
          this.updateGoal(type, value)
        )
        
        await Promise.all(promises)
        console.log('GoalStore: Set multiple goals:', goalsObject)
      } catch (error) {
        this.handleApiError(error, 'Failed to set multiple goals')
        throw error
      }
    },

    // Reset all goals to 0
    async resetAllGoals() {
      try {
        const resetGoals = {
          calories: 0,
          proteins: 0,
          carbohydrates: 0,
          fats: 0
        }
        
        await this.setGoals(resetGoals)
        console.log('GoalStore: Reset all goals')
      } catch (error) {
        this.handleApiError(error, 'Failed to reset all goals')
        throw error
      }
    },

    handleApiError(error, contextMessage = 'An API error occurred') {
      console.error(contextMessage, error) // Log the full error for debugging
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            this.latestErrorMessage = '400 Bad Request: ' + error.response.data.message
            break
          case 401:
            this.latestErrorMessage = '401 Unauthorized: ' + error.response.data.message
            break
          case 403:
            this.latestErrorMessage = '403 Forbidden: ' + error.response.data.message
            break
          case 404:
            this.latestErrorMessage = '404 Not Found: ' + error.response.data.message
            break
          default:
            this.latestErrorMessage = 'An error occurred: ' + error.response.data.message
            break
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.latestErrorMessage = 'No response from server. Please check your network connection.'
      } else {
        // Something happened in setting up the request that triggered an Error
        this.latestErrorMessage = error.message || 'Error setting up the request.'
      }
    }
  }
})
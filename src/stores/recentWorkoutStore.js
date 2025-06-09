import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient';  // import the configured axios instance

export const useRecentWorkoutStore = defineStore('recentWorkout', {
  name: 'RecentWorkoutPage',
  state: () => ({
    recentWorkouts: [],
  }),
  actions: {

    async callGetAllRecentWorkouts() {
      try {
        const response = await apiClient.get('/api/recentworkouts');
        this.recentWorkouts = response.data.workouts;
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch workouts');
      }
    },

    async addRecentWorkout(workoutData) {

      try {
        const newWorkout = {
          ...workoutData,
        }
        const response = await apiClient.post('/api/recentworkouts', newWorkout);
        this.recentWorkouts.push(response.data.workout)

        /*if (this.recentWorkouts.length > 10) {
          this.recentWorkouts.pop() // Keep only last 10 workouts
        }*/
        console.log('Added new workout:', response.data.workout)
      } catch (error) {
        this.handleApiError(error, 'Failed to add workout');
      }

    },

    handleApiError(error, contextMessage = 'An API error occurred') {
      console.error(contextMessage, error); // Log the full error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            this.latestErrorMessage = 'Bad Request: ' + error.response.data.message;
            break;
          case 401:
            this.latestErrorMessage = 'Unauthorized: ' + error.response.data.message;
            break;
          case 403:
            this.latestErrorMessage = 'Forbidden: ' + error.response.data.message;
            break;
          case 404:
            this.latestErrorMessage = 'Not Found: ' + error.response.data.message;
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

import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient';  // import the configured axios instance

export function createEmptyExercise() {
  return {
    id: null,
    name: '',
    description: '',
    tags: [''],
    difficulty: '',
    image: null,
    intensity: 1,
    own: false,
    favorite: false,
  }
}

export const useExerciseStore = defineStore('exercise', {
  name: 'ExercisePage',
  state: () => ({
    exercises: [],
  }),
  getters: {
    myExercises: (state) => {
      return state.exercises
        .filter((exercise) => exercise.own === true)
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    sharedExercises: (state) => {
      return state.exercises
        .filter((exercise) => exercise.own === false)
        .sort((a, b) => a.name.localeCompare(b.name))
    },
  },
  actions: {

    async callGetAllExercises() {
      try {
        const response = await apiClient.get('/api/exercises');
        this.exercises = response.data.exercises;
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch exercises');
      }
    },

    async addExercise(exerciseData) {
      if (!exerciseData.name) {
        alert('Please fill in at least the name.')
        return
      }
      try {
        const newExercise = {
          ...exerciseData,
          own: true,
        }
        const response = await apiClient.post('/api/exercises', newExercise);
        this.exercises.push(response.data.exercise)
        console.log('Added new exercise:', response.data.exercise)
      } catch (error) {
        this.handleApiError(error, 'Failed to add exercise');
      }

    },

    async updateExercise(updatedExerciseData) {
      const index = this.exercises.findIndex((exercise) => exercise.id === updatedExerciseData.id)
      if (index !== -1) {
        try {
          const response = await apiClient.put(`/api/exercises/${updatedExerciseData.id}`, updatedExerciseData);
          this.exercises.splice(index, 1, { ...response.data.updatedExercise })
          console.log('Updated exercise:', response.data.updatedExercise.name)
        } catch (error) {
          this.handleApiError(error, 'Failed to update exercise');
        }

      } else {
        console.warn('ExerciseStore: Exercise not found for update - ID:', updatedExerciseData.id)
      }
    },

    async deleteExercise(exerciseId) {
      const initialLength = this.exercises.length
      const exerciseName = this.exercises.find((e) => e.id === exerciseId)?.name || 'Unknown Exercise'
      try {
        await apiClient.delete(`/api/exercises/${exerciseId}`)
        this.exercises = this.exercises.filter((exercise) => exercise.id !== exerciseId)
        if (this.exercises.length < initialLength) {
          console.log('ExerciseStore: Deleted exercise - Name:', exerciseName)
        } else {
          console.warn('ExerciseStore: Exercise not found for deletion - ID:', exerciseId)
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to delete exercise')
      }

    },

    async favoriteExercise(exerciseId) {
      const exercise = this.exercises.find((e) => e.id === exerciseId)
      try {
        await apiClient.patch(`/api/exercises/${exerciseId}?favorite=${!exercise.favorite}`)
        exercise.favorite = !exercise.favorite
        console.log('ExerciseStore: Set favorite of:', exercise.name, 'to', exercise.favorite)
      } catch (error) {
        this.handleApiError(error, 'Failed to favorite exercise')
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
        alert(this.latestErrorMessage);
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

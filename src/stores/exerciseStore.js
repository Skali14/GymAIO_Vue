import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient';  // import the configured axios instance
import { usePlanStore } from './planStore'  // import the plan store

export function createEmptyExercise() {
  return {
    _id: null,
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
        console.log(response.data.exercises);
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
      const index = this.exercises.findIndex((exercise) => exercise._id === updatedExerciseData._id)
      if (index !== -1) {
        try {
          const response = await apiClient.put(`/api/exercises/${updatedExerciseData._id}`, updatedExerciseData);
          this.exercises.splice(index, 1, { ...response.data.updatedExercise })
          console.log('Updated exercise:', response.data.updatedExercise.name)
        } catch (error) {
          this.handleApiError(error, 'Failed to update exercise');
        }

      } else {
        console.warn('ExerciseStore: Exercise not found for update - ID:', updatedExerciseData._id)
      }
    },

    async deleteExercise(exerciseId) {
      const initialLength = this.exercises.length
      const exerciseName = this.exercises.find((e) => e._id === exerciseId)?.name || 'Unknown Exercise'
      try {
        await apiClient.delete(`/api/exercises/${exerciseId}`)
        this.exercises = this.exercises.filter((exercise) => exercise._id !== exerciseId)

        // Get the plan store instance
        const planStore = usePlanStore()

        // Update all plans to remove the deleted exercise
        for (const plan of planStore.plans) {
          const updatedExercises = plan.exercises.filter(ex => ex._id !== exerciseId)
          if (updatedExercises.length !== plan.exercises.length) {
            // Only update if the exercise was actually in the plan
            if(updatedExercises.length === 0) {
              // If the exercise is not in any plan, delete the plan
              await planStore.deletePlan(plan._id)
            } else {
            const updatedPlan = {
              ...plan,
              exercises: updatedExercises
            }

            await planStore.updatePlan(updatedPlan)
            }
          }
        }

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
      const exercise = this.exercises.find((e) => e._id.toString() === exerciseId)
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

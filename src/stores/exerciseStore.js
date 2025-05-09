import { defineStore } from 'pinia'

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
    exercises: [
      {
        id: Date.now() + 1,
        name: 'Cable Flys',
        description: 'Using cable tower to train chest.',
        tags: ['push', 'upper-body', 'chest'],
        difficulty: 'intermediate',
        image: null,
        intensity: 7,
        own: true,
        favorite: false,
      },
      {
        id: Date.now() + 2,
        name: 'Leg Extensions',
        description: 'Ancient torture method.',
        tags: ['legs'],
        difficulty: 'beginner',
        image: null,
        intensity: 8,
        own: true,
        favorite: false,
      },
      {
        id: Date.now() + 3,
        name: 'Benchpress',
        description: 'Most popular exercise',
        tags: ['push', 'upper-body', 'chest'],
        difficulty: 'intermediate',
        image: null,
        intensity: 9,
        own: false,
        favorite: false,
      },
      {
        id: Date.now() + 4,
        name: 'Barbell Row',
        description: 'Advanced method for training back.',
        tags: ['pull', 'back', 'upper-body'],
        difficulty: 'advanced',
        image: null,
        intensity: 8,
        own: false,
        favorite: false,
      },
      {
        id: Date.now() + 5,
        name: 'Reverse Butterfly',
        description: 'Using cable tower to train back and shoulders.',
        tags: ['pull', 'shoulder', 'upper-body'],
        difficulty: 'beginner',
        image: null,
        intensity: 6,
        own: false,
        favorite: false,
      },
      {
        id: Date.now() + 6,
        name: 'Squats',
        description: 'Really advanced and mechanically complex exercise.',
        tags: ['legs'],
        difficulty: 'advanced',
        image: null,
        intensity: 9,
        own: false,
        favorite: false,
      },
    ],
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
    addExercise(exerciseData) {
      if (!exerciseData.name) {
        alert('Please fill in at least the name.')
        return
      }

      const newExercise = {
        ...exerciseData,
        id: Date.now(),
        own: true,
      }
      this.exercises.push(newExercise)
      console.log('Added new exercise:', newExercise)
    },

    updateExercise(updatedExerciseData) {
      const index = this.exercises.findIndex((exercise) => exercise.id === updatedExerciseData.id)
      if (index !== -1) {
        this.exercises.splice(index, 1, { ...updatedExerciseData })
        console.log('Updated exercise:', updatedExerciseData.name)
      } else {
        console.warn('ExerciseStore: Exercise not found for update - ID:', updatedExerciseData.id)
      }
    },

    deleteExercise(exerciseId) {
      const initialLength = this.exercises.length
      const exerciseName =
        this.exercises.find((e) => e.id === exerciseId)?.name || 'Unknown Exercise'
      this.exercises = this.exercises.filter((exercise) => exercise.id !== exerciseId)
      if (this.exercises.length < initialLength) {
        console.log('ExerciseStore: Deleted exercise - Name:', exerciseName)
      } else {
        console.warn('ExerciseStore: Exercise not found for deletion - ID:', exerciseId)
      }
    },

    favoriteExercise(exerciseId) {
      const exercise = this.exercises.find((e) => e.id === exerciseId)
      exercise.favorite = !exercise.favorite
      console.log('ExerciseStore: Set favorite of:', exercise.name, 'to', exercise.favorite)
    },
  },
})

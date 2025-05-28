<template>
  <article class="mb-8">
    <h3 class="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
      {{ tablename }}
    </h3>

    <div class="overflow-x-auto">
      <table
        v-if="exercises.length > 0"
        class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
      >
        <thead>
        <tr>
          <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Name</th>
          <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Difficulty Level</th>
          <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Tags</th>
          <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Intensity</th>
          <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-center font-semibold">Manage</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="exercise in exercises"
          :key="exercise.id"
          class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        >
          <td class="p-3 text-left">{{ exercise.name }}</td>
          <td class="p-3 text-left">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': exercise.difficulty === 'beginner',
                      'bg-yellow-100 text-yellow-800': exercise.difficulty === 'intermediate',
                      'bg-red-100 text-red-800': exercise.difficulty === 'advanced'
                    }">
                {{ exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1) }}
              </span>
          </td>
          <td class="p-3 text-left">
            <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in exercise.tags"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ formatEntry(tag) }}
                </span>
            </div>
          </td>
          <td class="p-3 text-left">
            <div class="flex items-center">
              <span class="mr-2">{{ exercise.intensity }}</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(exercise.intensity / 10) * 100}%` }"
                ></div>
              </div>
            </div>
          </td>
          <td class="p-3 text-center">
            <div class="inline-flex justify-center gap-2 items-center">
              <button
                v-if="tablename === 'My Exercises'"
                @click.prevent="requestEdit(exercise)"
                title="Edit exercise"
                class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <button
                v-if="tablename === 'My Exercises'"
                @click.prevent="handleDeleteExercise(exercise.id, exercise.name)"
                title="Delete exercise"
                class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                @click.prevent="handleFavoriteExercise(exercise.id)"
                title="Add to Favourites"
                class="p-1 hover:bg-yellow-50 rounded-full transition-colors duration-200"
                :class="exercise.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="exercise.favorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="exercises.length === 0" class="text-center py-8 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.459M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p>You have not created any exercises yet.</p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapStores } from 'pinia'
import { useExerciseStore } from '@/stores/exerciseStore.js'

export default {
  name: 'ExerciseTable',
  props: {
    exercises: {
      type: Array,
      default: () => [],
    },
    tablename: {
      type: String,
      required: true,
    },
  },
  emits: ['exercise-deleted', 'edit-exercise'],
  computed: {
    ...mapStores(useExerciseStore),
  },
  methods: {
    handleDeleteExercise(exerciseId, exerciseName) {
      if (confirm(`Are you sure you want to delete "${exerciseName}"?`)) {
        this.exerciseStore.deleteExercise(exerciseId)
        this.$emit('exercise-deleted', exerciseId)
      }
    },
    requestEdit(exercise) {
      this.$emit('edit-exercise', exercise)
    },
    handleFavoriteExercise(exerciseId) {
      this.exerciseStore.favoriteExercise(exerciseId)
    },
    formatEntry(str) {
      return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
  },
}
</script>

<style scoped></style>

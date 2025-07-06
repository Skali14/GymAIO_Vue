<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage shared exercises for all users</p>
      </div>

      <!-- Main Content Container -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left: Exercise Form Section -->
        <div class="flex-1 lg:max-w-md">
          <ExerciseForm
            v-model="currentExercise"
            :is-editing="isEditing"
            :file-input-key="fileInputKey"
            @submit-exercise="handleFormSubmit"
            @cancel-edit="cancelEdit"
          />
        </div>

        <!-- Right: Exercise Tables Section -->
        <div class="flex-1">
          <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Shared Exercises Management
            </h2>

            <!-- Exercise Table -->
            <article class="mb-8">
              <h3 class="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
                All Shared Exercises
              </h3>

              <div class="overflow-x-auto">
                <table
                  v-if="exerciseStore.sharedExercises.length > 0"
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
                    v-for="exercise in exerciseStore.sharedExercises"
                    :key="exercise._id"
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
                          @click.prevent="startEdit(exercise)"
                          title="Edit exercise"
                          class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        <button
                          @click.prevent="handleDeleteExercise(exercise._id, exercise.name)"
                          title="Delete exercise"
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

                <div v-if="exerciseStore.sharedExercises.length === 0" class="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.459M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No shared exercises have been created yet.</p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import { useExerciseStore, createEmptyExercise } from '@/stores/exerciseStore.js'
import ExerciseForm from '@/components/ExerciseForm.vue'

export default {
  name: 'AdminDashboard',
  components: { ExerciseForm },
  data() {
    return {
      currentExercise: createEmptyExercise(),
      isEditing: false,
      fileInputKey: 0,
    }
  },
  computed: {
    ...mapStores(useExerciseStore),
  },
  methods: {
    handleFormSubmit() {
      if (!this.currentExercise.name) {
        alert('Exercise name is required.')
        return
      }
      this.currentExercise.own = false;
      delete this.currentExercise.favorite;

      if (this.isEditing) {
        this.exerciseStore.updateExercise({...this.currentExercise})
      } else {
        this.exerciseStore.addExercise({...this.currentExercise})
      }
      this.resetForm()
    },
    handleDeleteExercise(exerciseId, exerciseName) {
      if (confirm(`Are you sure you want to delete the shared exercise "${exerciseName}"?`)) {
        this.exerciseStore.deleteExercise(exerciseId)

        // If the currently edited exercise was deleted, reset the form
        if (this.isEditing && this.currentExercise._id === exerciseId) {
          this.resetForm()
        }
      }
    },
    resetForm() {
      this.currentExercise = createEmptyExercise()
      this.fileInputKey++
      this.isEditing = false
    },
    startEdit(exerciseToEdit) {
      this.currentExercise = { ...exerciseToEdit }
      this.isEditing = true
      console.log('AdminDashboardView: Editing shared exercise -', exerciseToEdit.name)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEdit() {
      this.resetForm()
      console.log('AdminDashboardView: Cancelled edit.')
    },
    formatEntry(str) {
      return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
  },
  mounted() {
    console.log('AdminDashboardView mounted!')
    this.exerciseStore.callGetAllExercises()
  },
}
</script>

<style scoped>
</style>

<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
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
              Saved Exercises
            </h2>

            <ExerciseTable
              tablename="My Exercises"
              :exercises="exerciseStore.myExercises"
              @edit-exercise="(exercise) => startEdit(exercise)"
              @exercise-deleted="(exerciseId) => handleExerciseDeleted(exerciseId)"
            />

            <ExerciseTable
              tablename="Shared Exercises"
              :exercises="exerciseStore.sharedExercises"
            />
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import { useExerciseStore, createEmptyExercise } from '@/stores/exerciseStore.js'
import ExerciseTable from '@/components/ExerciseTable.vue'
import ExerciseForm from '@/components/ExerciseForm.vue'

export default {
  name: 'ExercisePage',
  components: { ExerciseTable, ExerciseForm },
  data() {
    return {
      currentExercise: createEmptyExercise(),
      mobileMenuOpen: false,
      isEditing: false,
      fileInputKey: 0,
    }
  },
  computed: {
    ...mapStores(useExerciseStore),
  },
  methods: {
    handleFormSubmit() {
      if (this.isEditing) {
        this.exerciseStore.updateExercise({ ...this.currentExercise })
      } else {
        this.exerciseStore.addExercise({ ...this.currentExercise })
      }
      this.resetForm()
    },
    handleExerciseDeleted(deletedExerciseId) {
      console.log('ExercisePage: Received exercise-deleted event for ID', deletedExerciseId)

      if (this.isEditing && this.currentExercise.id === deletedExerciseId) {
        console.log('ExercisePage: The currently edited exercise was deleted. Resetting form.')
        this.resetForm()
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
      console.log('ExercisePage: Editing exercise -', exerciseToEdit.name)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEdit() {
      this.resetForm()
      console.log('Cancelled edit.')
    },
  },
  mounted() {
    console.log('ExercisePage mounted!')
    this.exerciseStore.callGetAllExercises()
  },
}
</script>

<style scoped></style>

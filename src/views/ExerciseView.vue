<template>
  <div class="bg-[#f4f4f4] text-[#333] font-sans m-0 p-0 min-h-screen flex flex-col items-center">
    <main
      class="flex justify-center flex-col lg:flex-row m-5 gap-4 md:gap-8 flex-1 max-w-[1400px] w-full p-2"
    >
      <div class="w-full lg:w-[370px] lg:flex-none">
        <ExerciseForm
          v-model="currentExercise"
          :is-editing="isEditing"
          :file-input-key="fileInputKey"
          @submit-exercise="handleFormSubmit"
          @cancel-edit="cancelEdit"
        />
      </div>

      <div class="flex-1">
        <section class="bg-white rounded-xl shadow-section overflow-hidden pb-5">
          <h2
            class="bg-gradient-to-br from-[#888] to-custom-formheader text-white m-0 py-3 px-4 md:py-4 md:px-5 text-2xl md:text-3xl tracking-wider font-semibold"
          >
            Saved Exercises
          </h2>

          <ExerciseTable
            tablename="My Exercises"
            :exercises="exerciseStore.myExercises"
            @edit-exercise="(exercise) => startEdit(exercise)"
            @exercise-deleted="(exerciseId) => handleExerciseDeleted(exerciseId)"
          ></ExerciseTable>

          <ExerciseTable
            tablename="Shared Exercises"
            :exercises="exerciseStore.sharedExercises"
          ></ExerciseTable>
        </section>
      </div>
    </main>
  </div>
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
      document.getElementById('exercise-form')?.scrollIntoView({ behavior: 'smooth' })
    },
    cancelEdit() {
      this.resetForm()
      console.log('Cancelled edit.')
    },
  },
  mounted() {
    console.log('ExercisePage mounted!')
  },
}
</script>

<style scoped></style>

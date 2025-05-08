<template>
  <div class="bg-[#f4f4f4] text-[#333] font-sans m-0 p-0 min-h-screen flex flex-col items-center">
    <main
      class="flex justify-center flex-col lg:flex-row m-5 gap-4 md:gap-8 flex-1 max-w-[1400px] w-full p-2"
    >
      <div class="w-full lg:w-[370px] lg:flex-none">
        <section class="bg-custom-formbg rounded-xl shadow-section overflow-hidden mb-4 lg:mb-0">
          <h2
            class="bg-gradient-to-br from-[#888] to-custom-formheader text-white m-0 py-3 px-4 md:py-4 md:px-5 text-2xl md:text-3xl tracking-wider font-semibold"
          >
            {{ isEditing ? 'Update an exercise' : 'Create a new exercise' }}
          </h2>
          <form
            id="exercise-form"
            class="bg-white p-4 md:p-6 m-0 w-full box-border rounded-none shadow-none"
            @submit.prevent="handleFormSubmit"
          >
            <div class="mb-5">
              <label for="exercise-name" class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Name:</strong></label
              >
              <input
                type="text"
                id="exercise-name"
                name="exercise-name"
                v-model.trim="currentExercise.name"
                required
                placeholder="e.g. Benchpress"
                class="w-full py-2.5 px-3 border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
              />
            </div>

            <div class="mb-5">
              <label for="exercise-description" class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Description:</strong></label
              >
              <textarea
                id="exercise-description"
                name="exercise-description"
                v-model="currentExercise.description"
                rows="5"
                cols="40"
                placeholder="Enter exercise description here..."
                class="w-full py-2.5 px-3 border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none resize-none"
              ></textarea>
            </div>

            <div class="mb-5">
              <label for="exercise-tags" class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Tags:</strong>
                <span class="font-normal text-xs text-[#777] italic invisible lg:visible">
                  (hold Ctrl/Cmd to select multiple)</span
                ></label
              >
              <select
                id="exercise-tags"
                name="exercise-tags"
                v-model="currentExercise.tags"
                multiple
                class="w-full h-auto min-h-[120px] p-2.5 bg-custom-inputbg border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
              >
                <option value="pull" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Pull
                </option>
                <option value="push" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Push
                </option>
                <option
                  value="upper-body"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Upper Body
                </option>
                <option
                  value="chest"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Chest
                </option>
                <option value="back" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Back
                </option>
                <option
                  value="shoulder"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Shoulder
                </option>
                <option value="legs" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Legs
                </option>
                <option value="arms" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Arms
                </option>
                <option value="core" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
                  Core
                </option>
                <option
                  value="cardio"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Cardio
                </option>
              </select>
            </div>

            <div class="mb-5">
              <label for="exercise-difficulty" class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Difficulty Level:</strong></label
              >
              <select
                id="exercise-difficulty"
                name="exercise-difficulty"
                v-model="currentExercise.difficulty"
                class="w-full h-auto py-2.5 px-3 bg-custom-inputbg border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
              >
                <option
                  value="beginner"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Beginner
                </option>
                <option
                  value="intermediate"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Intermediate
                </option>
                <option
                  value="advanced"
                  class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
                >
                  Advanced
                </option>
              </select>
            </div>

            <div class="mb-5">
              <label
                for="exercise-form-explanation"
                class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Upload Exercise Image:</strong></label
              >
              <input
                type="file"
                id="exercise-form-explanation"
                :key="fileInputKey"
                name="exercise-form-explanation"
                accept="image/*"
                @change="handleFileUpload"
                class="w-full py-2.5 px-3 border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
              />
            </div>

            <div class="mb-5">
              <label for="exercise-intensity" class="block font-bold mb-2 text-[#555] text-sm"
                ><strong>Intensity:</strong></label
              >
              <input
                type="range"
                min="1"
                max="10"
                value="5"
                id="exercise-intensity"
                v-model="currentExercise.intensity"
                name="exercise-intensity"
                class="w-full h-1.5 bg-[#ddd] appearance-none rounded-full cursor-pointer"
              />
            </div>

            <div :class="isEditing ? 'flex gap-4' : ''">
              <button
                type="button"
                v-if="isEditing"
                @click="cancelEdit"
                class="w-1/2 py-3 px-3 bg-gradient-to-br from-[#888] to-custom-buttonbg text-white font-bold tracking-wider uppercase text-sm rounded-md border-0 cursor-pointer transition-all duration-300 hover:from-[#777] hover:to-custom-buttonhover hover:-translate-y-0.5 hover:shadow-btn active:translate-y-0"
              >
                Cancel Edit
              </button>

              <button
                type="submit"
                :class="[
                  'py-3 px-3 bg-gradient-to-br from-[#888] to-custom-buttonbg text-white font-bold tracking-wider uppercase text-sm rounded-md border-0 cursor-pointer transition-all duration-300 hover:from-[#777] hover:to-custom-buttonhover hover:-translate-y-0.5 hover:shadow-btn active:translate-y-0',
                  isEditing ? 'w-1/2' : 'w-full',
                ]"
              >
                {{ isEditing ? 'Update Exercise' : 'Add Exercise' }}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div class="flex-1">
        <section class="bg-white rounded-xl shadow-section overflow-hidden pb-5">
          <h2
            class="bg-gradient-to-br from-[#888] to-custom-formheader text-white m-0 py-3 px-4 md:py-4 md:px-5 text-2xl md:text-3xl tracking-wider font-semibold"
          >
            Saved Exercises
          </h2>

          <article class="px-3 md:px-5">
            <h3 class="text-[#555] border-b-2 border-[#eee] pb-2 mt-5 text-xl font-bold">
              My Exercises
            </h3>
            <div class="mt-6 overflow-x-auto">
              <table
                v-if="this.exerciseStore.myExercises.length > 0"
                id="my"
                class="w-full my-0 mb-5 border-collapse border-spacing-0 bg-white rounded-lg overflow-hidden shadow-table min-w-[650px]"
              >
                <thead>
                  <tr>
                    <th
                      class="bg-gradient-to-br from-[#777] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#777] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Difficulty Level
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#777] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Tags
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#777] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Intensity
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#777] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="exercise in this.exerciseStore.myExercises"
                    :key="exercise.id"
                    class="border-b border-custom-tableborder hover:bg-custom-tablehover"
                  >
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.name }}</td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">
                      {{
                        exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)
                      }}
                    </td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">
                      {{ exercise.tags.map(formatEntry).join(', ') }}
                    </td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.intensity }}</td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-center">
                      <a
                        href="#edit"
                        @click.prevent="startEdit(exercise)"
                        title="Edit exercise"
                        class="mx-1 md:mx-1.5 inline-block transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          src="/edit.svg"
                          alt="Modify"
                          width="18"
                          height="18"
                          style="vertical-align: middle"
                        />
                      </a>
                      <a
                        href="#delete"
                        @click.prevent="handleDeleteExercise(exercise.id)"
                        title="Delete exercise"
                        class="mx-1 md:mx-1.5 inline-block transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          src="/trash.svg"
                          alt="Delete"
                          width="18"
                          height="18"
                          style="vertical-align: middle"
                        />
                      </a>
                      <a
                        href="#favorite"
                        @click.prevent="handleFavoriteExercise(exercise.id)"
                        title="Add to Favourites"
                        class="mx-1 md:mx-1.5 inline-block transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          :src="exercise.favorite ? '/favorite_full.svg' : '/favorite.svg'"
                          alt="Favorite"
                          width="18"
                          height="18"
                          style="vertical-align: middle"
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="this.exerciseStore.myExercises.length === 0">You have not created any exercises yet.</p>
            </div>
          </article>

          <article class="px-3 md:px-5">
            <h3 class="text-[#555] border-b-2 border-[#eee] pb-2 mt-5 text-xl font-bold">
              Shared Exercises
            </h3>
            <div class="mt-6 overflow-x-auto">
              <table
                v-if="this.exerciseStore.sharedExercises.length > 0"
                id="shared"
                class="w-full my-0 mb-5 border-collapse border-spacing-0 bg-white rounded-lg overflow-hidden shadow-table min-w-[650px]"
              >
                <thead>
                  <tr>
                    <th
                      class="bg-gradient-to-br from-[#888] to-[#777] text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#888] to-[#777] text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Difficulty Level
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#888] to-[#777] text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Tags
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#888] to-[#777] text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Intensity
                    </th>
                    <th
                      class="bg-gradient-to-br from-[#888] to-[#777] text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
                    >
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="exercise in this.exerciseStore.sharedExercises"
                    :key="exercise.id"
                    class="border-b border-custom-tableborder hover:bg-custom-tablehover"
                  >
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.name }}</td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">
                      {{
                        exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)
                      }}
                    </td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">
                      {{ exercise.tags.map(formatEntry).join(', ') }}
                    </td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.intensity }}</td>
                    <td class="py-2 px-2 md:py-3 md:px-4 text-center">
                      <a
                        href="#favorite"
                        @click.prevent="handleFavoriteExercise(exercise.id)"
                        title="Add to Favourites"
                        class="mx-1 md:mx-1.5 inline-block transition-transform duration-200 hover:scale-110"
                      >
                        <img
                          :src="exercise.favorite ? '/favorite_full.svg' : '/favorite.svg'"
                          alt="Favorite"
                          width="18"
                          height="18"
                          style="vertical-align: middle"
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="this.exerciseStore.sharedExercises.length === 0">
                No exercises could be fetched from the server.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useExerciseStore, createEmptyExercise } from '@/stores/exerciseStore.js'

export default {
  name: 'ExercisePage',
  data() {
    return {
      currentExercise: createEmptyExercise(),
      mobileMenuOpen: false,
      isEditing: false,
      fileInputKey: 0,
    }
  },
  computed: {
    ...mapStores(useExerciseStore)
  },
  methods: {
    handleFormSubmit() {
      if (this.isEditing) {
        this.exerciseStore.updateExercise({ ...this.currentExercise }) // Access action via dishStore
      } else {
        this.exerciseStore.addExercise({ ...this.currentExercise }) // Access action via dishStore
      }
      this.resetForm()
    },
    handleFavoriteExercise(exerciseId) {
      this.exerciseStore.favoriteExercise(exerciseId)
    },

    handleDeleteExercise(deletedExerciseId) {
      // Check if the deleted dish is the one currently being edited
      this.exerciseStore.deleteExercise(deletedExerciseId)

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
    formatEntry(str) {
      return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.currentExercise.image = file
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

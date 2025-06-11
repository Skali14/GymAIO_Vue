<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 lg:max-w-md">
          <section
            id="planner-form"
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4 lg:mb-0"
          >
            <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              Create Workout Plan
            </h2>

            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label for="plan-name" class="block font-bold mb-2 text-gray-700">Plan Name:</label>
                <input
                  type="text"
                  id="plan-name"
                  v-model="currentPlan.name"
                  required
                  placeholder="e.g. Upper Body Strength"
                  class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                />
              </div>

              <div class="mb-4">
                <label for="plan-description" class="block font-bold mb-2 text-gray-700">Description:</label>
                <textarea
                  id="plan-description"
                  v-model="currentPlan.description"
                  rows="3"
                  placeholder="Enter plan description here..."
                  class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <!-- Exercise Drop Zone -->
              <div class="mb-6">
                <label class="block font-bold mb-2 text-gray-700">
                  Exercises:
                  <span class="font-normal text-sm text-gray-500 ml-2">(drag exercises from the right panel)</span>
                </label>
                <div
                  class="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300"
                  :class="{
                    'border-green-400 bg-green-50': isDragOver,
                    'border-gray-300 bg-gray-50': !isDragOver && currentPlan.exercises.length === 0,
                    'border-gray-400 bg-white': !isDragOver && currentPlan.exercises.length > 0
                  }"
                  @drop="handleDrop"
                  @dragover.prevent="isDragOver = true"
                  @dragleave="isDragOver = false"
                  @dragenter.prevent
                >
                  <div v-if="currentPlan.exercises.length === 0" class="text-center text-gray-500 py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>Drag exercises here to build your workout plan</p>
                  </div>

                  <!-- Exercise List in Plan -->
                  <div v-else class="space-y-2">
                    <div
                      v-for="(exercise, index) in currentPlan.exercises"
                      :key="`plan-${exercise._id}-${index}`"
                      class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move hover:-translate-y-0.5"
                      draggable="true"
                      @dragstart="handleExerciseDragStart($event, index)"
                      @dragover.prevent
                      @drop="handleExerciseReorder($event, index)"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center flex-1">
                          <div class="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mr-3">
                            {{ index + 1 }}
                          </div>
                          <div class="flex-1">
                            <h4 class="font-medium text-gray-800">{{ exercise.name }}</h4>
                            <div class="flex items-center gap-2 mt-1">
                              <span class="text-xs px-2 py-1 rounded-full"
                                    :class="{
                                      'bg-green-100 text-green-800': exercise.difficulty === 'beginner',
                                      'bg-yellow-100 text-yellow-800': exercise.difficulty === 'intermediate',
                                      'bg-red-100 text-red-800': exercise.difficulty === 'advanced'
                                    }">
                                {{ exercise.difficulty }}
                              </span>
                              <span class="text-xs text-gray-500">Intensity: {{ exercise.intensity }}/10</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex items-center">
                            <label class="text-xs text-gray-600 mr-2">Sets:</label>
                            <input
                              type="number"
                              v-model.number="exercise.sets"
                              min="1"
                              max="20"
                              class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            @click="removeExercise(index)"
                            class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Remove exercise"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Plan Statistics -->
              <div v-if="currentPlan.exercises.length > 0" class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-2">Plan Summary</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Total Exercises:</span>
                    <span class="font-medium ml-1">{{ currentPlan.exercises.length }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Avg. Intensity:</span>
                    <span class="font-medium ml-1">{{ averageIntensity }}/10</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-600">Muscle Groups:</span>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="tag in uniqueTags"
                        :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ formatTag(tag) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div :class="isEditing ? 'flex gap-4' : ''">
                <button
                  type="button"
                  v-if="isEditing"
                  @click="cancelEdit"
                  class="w-full p-3 bg-gray-500 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-gray-600 hover:scale-105"
                >
                  Cancel Edit
                </button>

                <button
                  type="submit"
                  :disabled="currentPlan.exercises.length === 0"
                  class="w-full p-3 bg-green-600 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-green-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {{ isEditing ? 'Update Workout Plan' : 'Save Workout Plan' }}
                </button>
              </div>


            </form>
          </section>
        </div>

        <!-- Right: Available Exercises Section -->
        <div class="flex-1">
          <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Available Exercises
            </h2>

            <!-- Filter Controls -->
            <div class="mb-6 flex flex-wrap gap-4">
              <div>
                <label for="difficulty-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Difficulty:</label>
                <select
                  id="difficulty-filter"
                  v-model="difficultyFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label for="search-filter" class="block text-sm font-medium text-gray-700 mb-1">Search:</label>
                <input
                  id="search-filter"
                  type="text"
                  v-model="searchFilter"
                  placeholder="Search exercises..."
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="overflow-x-auto">
              <table
                v-if="filteredExercises.length > 0"
                class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <thead>
                <tr>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Name</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Difficulty</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Tags</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Intensity</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="exercise in filteredExercises"
                  :key="exercise._id"
                  class="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 cursor-grab active:cursor-grabbing hover:bg-blue-50"
                  draggable="true"
                  @dragstart="handleDragStart($event, exercise)"
                  :title="'Drag to add: ' + exercise.name"
                >
                  <td class="p-3 text-left">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {{ exercise.name }}
                      <svg v-if="exercise.favorite" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </td>
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
                        v-for="tag in exercise.tags.slice(0, 3)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ formatTag(tag) }}
                      </span>
                      <span v-if="exercise.tags.length > 3" class="text-xs text-gray-500">
                        +{{ exercise.tags.length - 3 }} more
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
                </tr>
                </tbody>
              </table>

              <div v-if="filteredExercises.length === 0" class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.459M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>No exercises found matching your criteria.</p>
              </div>
            </div>
          </section>

          <!-- Current Plans Section -->
          <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
            <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.94-6.071 2.459M16 8a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              Current Workout Plans
            </h2>

            <div class="overflow-x-auto">
              <table
                v-if="planStore.plans.length > 0"
                class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <thead>
                <tr>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Name</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Muscle Groups</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Avg Intensity</th>
                  <th class="p-3 bg-gray-500 text-white border-b border-gray-300 text-left font-semibold">Manage</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="plan in planStore.plans"
                  :key="plan._id"
                  class="border-b border-gray-200 hover:bg-purple-50 transition-colors duration-200"
                >
                  <td class="p-3 text-left">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        {{ plan.name }}
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-left">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in getPlanMuscleGroups(plan).slice(0, 3)"
                        :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ formatTag(tag) }}
                      </span>
                      <span v-if="getPlanMuscleGroups(plan).length > 3" class="text-xs text-gray-500">
                        +{{ getPlanMuscleGroups(plan).length - 3 }} more
                      </span>
                    </div>
                  </td>
                  <td class="p-3 text-left">
                    <div class="flex items-center">
                      <span class="mr-2">{{ getPlanAvgIntensity(plan) }}</span>
                      <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                        <div
                          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${(getPlanAvgIntensity(plan) / 10) * 100}%` }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-left">
                    <div class="inline-flex justify-center gap-2 items-center">
                      <button
                        @click="editPlan(plan)"
                        title="Edit plan"
                        class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        @click="deletePlan(plan._id)"
                        title="Delete plan"
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

              <div v-if="planStore.plans.length === 0" class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No workout plans created yet.</p>
                <p class="text-sm mt-1">
                  <span class="hidden lg:inline">Create your first plan using the form on the left!</span>
                  <span class="lg:hidden">Create your first plan using the form above!</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import { useExerciseStore } from '@/stores/exerciseStore.js'
import { usePlanStore } from '@/stores/planStore.js'

export default {
  name: 'PlannerView',
  data() {
    return {
      currentPlan: {
        _id: null,
        name: '',
        description: '',
        exercises: []
      },
      isDragOver: false,
      draggedExercise: null,
      draggedIndex: null,
      difficultyFilter: '',
      searchFilter: '',
      isEditing: false,
    }
  },
  computed: {
    ...mapStores(useExerciseStore),
    ...mapStores(usePlanStore),

    allExercises() {
      // Combine myExercises and sharedExercises, prioritize favorites
      const combined = [
        ...this.exerciseStore.myExercises,
        ...this.exerciseStore.sharedExercises
      ]

      // Sort favorites first, then by name
      return combined.sort((a, b) => {
        if (a.favorite && !b.favorite) return -1
        if (!a.favorite && b.favorite) return 1
        return a.name.localeCompare(b.name)
      })
    },

    filteredExercises() {
      return this.allExercises.filter(exercise => {
        const matchesDifficulty = !this.difficultyFilter || exercise.difficulty === this.difficultyFilter
        const matchesSearch = !this.searchFilter ||
          exercise.name.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
          exercise.tags.some(tag => tag.toLowerCase().includes(this.searchFilter.toLowerCase()))

        return matchesDifficulty && matchesSearch
      })
    },

    averageIntensity() {
      if (this.currentPlan.exercises.length === 0) return 0
      const total = this.currentPlan.exercises.reduce((sum, ex) => sum + parseInt(ex.intensity), 0)
      return Math.round(total / this.currentPlan.exercises.length * 10) / 10
    },

    uniqueTags() {
      const allTags = this.currentPlan.exercises.flatMap(ex => ex.tags)
      return [...new Set(allTags)]
    }
  },
  methods: {
    handleDragStart(event, exercise) {
      this.draggedExercise = exercise
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('text/plain', JSON.stringify(exercise))
    },

    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false

      if (this.draggedExercise) {
        // Check if exercise is already in the plan
        const existingIndex = this.currentPlan.exercises.findIndex(ex => ex._id === this.draggedExercise._id)
        if (existingIndex === -1) {
          // Add default sets value when adding a new exercise
          this.currentPlan.exercises.push({
            ...this.draggedExercise,
            sets: 3 // Default number of sets
          })
        }
        this.draggedExercise = null
      }
    },

    handleExerciseDragStart(event, index) {
      this.draggedIndex = index
      event.dataTransfer.effectAllowed = 'move'
    },

    handleExerciseReorder(event, targetIndex) {
      event.preventDefault()
      if (this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
        const draggedExercise = this.currentPlan.exercises[this.draggedIndex]
        this.currentPlan.exercises.splice(this.draggedIndex, 1)
        this.currentPlan.exercises.splice(targetIndex, 0, draggedExercise)
      }
      this.draggedIndex = null
    },

    removeExercise(index) {
      this.currentPlan.exercises.splice(index, 1)
    },

    async handleSubmit() {
      if (!this.currentPlan.name || this.currentPlan.exercises.length === 0) {
        alert('Please provide a plan name and add at least one exercise.')
        return
      }

      try {
        if (this.currentPlan._id) {
          // Update existing plan
          await this.planStore.updatePlan(this.currentPlan)
        } else {
          // Create new plan
          await this.planStore.addPlan(this.currentPlan)
        }
        this.resetForm()
      } catch (error) {
        this.error = error.message || 'Failed to save workout plan'
        alert(this.error)
      }
    },

    resetForm() {
      this.currentPlan = {
        _id: null,
        name: '',
        description: '',
        exercises: []
      }
      this.error = null
    },

    editPlan(plan) {
      this.currentPlan = { ...plan }
      this.isEditing = true
      console.log('PlannerPage: Editing plan -', plan.name)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() {
      this.resetForm()
      this.isEditing = false
      console.log('Cancelled edit.')
    },

    async deletePlan(planId) {
      if (confirm('Are you sure you want to delete this workout plan?')) {
        try {
          await this.planStore.deletePlan(planId)

          if (this.isEditing && this.currentPlan._id === planId) {
            console.log('PlannerPage: The currently edited plan was deleted. Resetting form.')
            this.resetForm()
          }
        } catch (error) {
          this.error = error.message || 'Failed to delete workout plan'
          alert(this.error)
        }
      }
    },

    formatTag(str) {
      return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

    getPlanMuscleGroups(plan) {
      const allTags = plan.exercises.flatMap(ex => ex.tags)
      return [...new Set(allTags)]
    },

    getPlanAvgIntensity(plan) {
      if (plan.exercises.length === 0) return 0
      const total = plan.exercises.reduce((sum, ex) => sum + parseInt(ex.intensity), 0)
      return Math.round(total / plan.exercises.length * 10) / 10
    }
  },
  mounted() {
    console.log('PlannerView mounted!')
    this.exerciseStore.callGetAllExercises()
    this.planStore.callGetAllPlans()
  }
}
</script>

<style scoped>
/* Custom styles that can't be replicated with Tailwind */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

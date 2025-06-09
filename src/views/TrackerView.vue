<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Workout Selection View -->
      <div v-if="!isWorkoutActive" class="space-y-8">
        <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Select Workout Plan
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="plan in planStore.plans"
              :key="plan.id"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
              @click="startWorkout(plan)"
            >
              <h3 class="font-semibold text-lg mb-2">{{ plan.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ plan.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in plan.exercises.flatMap(ex => ex.tags).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ tag.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
                </span>
              </div>
              <div class="mt-3 text-sm text-gray-500">
                {{ plan.exercises.length }} exercises
              </div>
            </div>
          </div>

          <div v-if="planStore.plans.length === 0" class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No workout plans available.</p>
            <p class="text-sm mt-1">Create a workout plan first to start tracking your exercises.</p>
          </div>
        </section>

        <!-- Recent Workouts Section -->
        <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Recent Workouts
          </h2>

          <div v-if="recentWorkoutStore.recentWorkouts.length > 0" class="space-y-4">
            <div
              v-for="workout in recentWorkoutStore.recentWorkouts"
              :key="workout.id"
              class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-lg">{{ workout.planName }}</h3>
                  <p class="text-sm text-gray-600">{{ formatDate(workout.date) }}</p>
                  <div class="mt-2 flex items-center gap-4">
                    <span class="text-sm text-gray-600">
                      <span class="font-medium">Duration:</span> {{ formatDuration(workout.duration) }}
                    </span>
                    <span class="text-sm text-gray-600">
                      <span class="font-medium">Exercises:</span> {{ workout.exercises.length }}
                    </span>
                  </div>
                </div>
                <button
                  @click="showWorkoutDetails(workout)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No completed workouts yet.</p>
            <p class="text-sm mt-1">Complete your first workout to see it here!</p>
          </div>
        </section>

        <!-- Workout Details Modal -->
        <div
          v-if="selectedWorkout"
          class="fixed inset-0 bg-gray-500/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
          @click.self="selectedWorkout = null"
        >
          <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">{{ selectedWorkout.planName }}</h3>
              <button
                @click="selectedWorkout = null"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-600">Date:</span>
                  <span class="ml-2">{{ formatDate(selectedWorkout.date) }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-600">Duration:</span>
                  <span class="ml-2">{{ formatDuration(selectedWorkout.duration) }}</span>
                </div>
              </div>

              <div class="border-t pt-4">
                <h4 class="font-semibold mb-3">Exercises</h4>
                <div class="space-y-4">
                  <div
                    v-for="exercise in selectedWorkout.exercises"
                    :key="exercise.id"
                    class="bg-gray-50 rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <h5 class="font-medium">{{ exercise.name }}</h5>
                        <div class="mt-2 space-y-1">
                          <div v-if="!exercise.skipped">
                            <span class="text-sm text-gray-600">Sets: {{ exercise.sets }}</span>
                            <span class="mx-2 text-gray-400">•</span>
                            <span class="text-sm text-gray-600">Reps: {{ exercise.reps }}</span>
                            <span class="mx-2 text-gray-400">•</span>
                            <span class="text-sm text-gray-600">Weight: {{ exercise.weight }}kg</span>
                          </div>
                          <div v-else class="text-sm text-red-600">
                            Exercise skipped
                          </div>
                          <div v-if="exercise.notes" class="text-sm text-gray-600 mt-1">
                            Notes: {{ exercise.notes }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Workout View -->
      <div v-else class="space-y-8">
        <!-- Timer and Progress -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">{{ selectedPlan.name }}</h2>
            <div class="flex items-center gap-4">
              <div class="text-2xl font-mono font-bold text-blue-600">
                {{ formattedTime }}
              </div>
              <button
                @click="cancelWorkout"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Cancel Workout
              </button>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((currentExerciseIndex + 1) / selectedPlan.exercises.length) * 100}%` }"
              ></div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              Exercise {{ currentExerciseIndex + 1 }} of {{ selectedPlan.exercises.length }}
            </div>
          </div>
        </div>

        <!-- Current Exercise -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Exercise Info -->
            <div>
              <h3 class="text-2xl font-bold mb-4">{{ currentExercise.name }}</h3>
              <p class="text-gray-600 mb-6">{{ currentExercise.description }}</p>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-500">Sets:</span>
                  <span class="text-sm">{{ currentExercise.sets }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-500">Difficulty:</span>
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': currentExercise.difficulty === 'beginner',
                      'bg-yellow-100 text-yellow-800': currentExercise.difficulty === 'intermediate',
                      'bg-red-100 text-red-800': currentExercise.difficulty === 'advanced'
                    }"
                  >
                    {{ currentExercise.difficulty }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-500">Intensity:</span>
                  <div class="flex items-center">
                    <span class="text-sm mr-2">{{ currentExercise.intensity }}/10</span>
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        :style="{ width: `${(currentExercise.intensity / 10) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span class="text-sm font-medium text-gray-500">Muscle Groups:</span>
                  <span
                    v-for="tag in currentExercise.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ tag.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Exercise Image -->
            <div class="flex items-center justify-center">
              <img
                v-if="currentExercise.image"
                :src="currentExercise.image"
                :alt="currentExercise.name"
                class="max-w-full h-auto rounded-lg shadow-md"
              />
              <div
                v-else
                class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Exercise Input -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repetitions</label>
              <input
                type="number"
                v-model="currentReps"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                placeholder="Enter reps"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                v-model="currentWeight"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                placeholder="Enter weight"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                v-model="notes"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                placeholder="Add notes (optional)"
              />
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="skipExercise"
              class="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Skip Exercise
            </button>
            <button
              @click="nextExercise"
              class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {{ isLastExercise ? 'Finish Workout' : 'Next Exercise' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'
import { usePlanStore } from '@/stores/planStore'
import { useExerciseStore } from '@/stores/exerciseStore'
import { useRecentWorkoutStore } from '@/stores/recentWorkoutStore'

export default {
  name: 'TrackerView',
  data() {
    return {
      selectedPlan: null,
      currentExerciseIndex: 0,
      isWorkoutActive: false,
      timer: 0,
      timerInterval: null,
      exerciseResults: [],
      currentReps: '',
      currentWeight: '',
      notes: '',
      selectedWorkout: null
    }
  },
  computed: {
    ...mapStores(usePlanStore),
    ...mapStores(useExerciseStore),
    ...mapStores(useRecentWorkoutStore),

    currentExercise() {
      if (!this.selectedPlan || this.currentExerciseIndex >= this.selectedPlan.exercises.length) return null
      return this.selectedPlan.exercises[this.currentExerciseIndex]
    },

    isLastExercise() {
      if (!this.selectedPlan) return false
      return this.currentExerciseIndex === this.selectedPlan.exercises.length - 1
    },

    formattedTime() {
      const minutes = Math.floor(this.timer / 60)
      const seconds = this.timer % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  },
  methods: {
    startWorkout(plan) {
      this.selectedPlan = plan
      this.isWorkoutActive = true
      this.currentExerciseIndex = 0
      this.exerciseResults = []
      this.startTimer()
    },

    startTimer() {
      this.timer = 0
      this.timerInterval = setInterval(() => {
        this.timer++
      }, 1000)
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    nextExercise() {
      if (this.currentReps && this.currentWeight) {
        this.exerciseResults.push({
          exerciseId: this.currentExercise.id,
          reps: parseInt(this.currentReps),
          weight: parseFloat(this.currentWeight),
          notes: this.notes
        })

        this.currentReps = ''
        this.currentWeight = ''
        this.notes = ''

        if (this.isLastExercise) {
          this.finishWorkout()
        } else {
          this.currentExerciseIndex++
        }
      } else {
        alert('Please enter both reps and weight before proceeding.')
      }
    },

    skipExercise() {
      this.exerciseResults.push({
        exerciseId: this.currentExercise.id,
        skipped: true,
        notes: this.notes
      })

      this.currentReps = ''
      this.currentWeight = ''
      this.notes = ''

      if (this.isLastExercise) {
        this.finishWorkout()
      } else {
        this.currentExerciseIndex++
      }
    },

    cancelWorkout() {
      if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
        this.stopTimer()
        this.resetWorkout()
      }
    },

    finishWorkout() {
      this.stopTimer()
      // Save the workout results
      const completedWorkout = {
        id: Date.now(), // Using timestamp as a simple ID
        planName: this.selectedPlan.name,
        date: new Date(),
        duration: this.timer,
        exercises: this.exerciseResults.map(result => {
          const exercise = this.selectedPlan.exercises.find(ex => ex.id === result.exerciseId)
          return {
            id: exercise.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: result.reps,
            weight: result.weight,
            notes: result.notes,
            skipped: result.skipped
          }
        })
      }

      this.recentWorkoutStore.addRecentWorkout(completedWorkout)
      this.resetWorkout()
    },

    resetWorkout() {
      this.selectedPlan = null
      this.isWorkoutActive = false
      this.currentExerciseIndex = 0
      this.exerciseResults = []
      this.timer = 0
    },

    showWorkoutDetails(workout) {
      this.selectedWorkout = workout
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  },
  mounted() {
    this.planStore.callGetAllPlans()
    this.recentWorkoutStore.callGetAllRecentWorkouts()
  },

  beforeUnmount() {
    this.stopTimer()
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

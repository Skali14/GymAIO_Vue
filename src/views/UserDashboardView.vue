<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p class="text-gray-600 mt-1">Track your fitness progress and goals</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">{{ getCurrentDate() }}</div>
            <div class="text-lg font-semibold text-blue-600">Welcome back, {{ currentUser?.name || 'User' }}!</div>
          </div>
        </div>
      </section>

      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Today's Calories -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Today's Calories</p>
              <p class="text-2xl font-bold text-blue-600">{{ todayCalories }}</p>
              <p class="text-xs text-gray-500">Goal: {{ calorieGoal }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min((todayCalories / calorieGoal) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Workouts This Week -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Workouts This Week</p>
              <p class="text-2xl font-bold text-green-600">{{ weeklyWorkouts }}</p>
              <p class="text-xs text-gray-500">{{ weeklyWorkouts > lastWeekWorkouts ? '+' : '' }}{{ weeklyWorkouts - lastWeekWorkouts }} from last week</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Plans -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Plans</p>
              <p class="text-2xl font-bold text-purple-600">{{ planStore.plans.length }}</p>
              <p class="text-xs text-gray-500">{{ totalExercises }} total exercises</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Calorie Intake Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Daily Calorie Intake</h3>
            <select v-model="calorieChartPeriod" class="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div class="h-64">
            <Line :data="calorieChartData" :options="calorieChartOptions" />
          </div>
        </div>

        <!-- Weight Progress Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Exercise Progress</h3>
            <select v-model="selectedExercise" class="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option value="">Select Exercise</option>
              <option v-for="exercise in exerciseStore.exercises" :key="exercise._id" :value="exercise._id">
                {{ exercise.name }}
              </option>
            </select>
          </div>
          <div class="h-64">
            <Line v-if="selectedExercise" :data="weightProgressData" :options="weightProgressOptions" />
            <div v-else class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Select an exercise to view progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity and Goals -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Workouts -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Recent Workouts
          </h3>

          <div v-if="recentWorkoutStore.recentWorkouts.length > 0" class="space-y-4">
            <div
              v-for="workout in recentWorkoutStore.recentWorkouts.slice(0, 5)"
              :key="workout._id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center space-x-4">
                <div class="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium">{{ workout.planName }}</h4>
                  <p class="text-sm text-gray-600">{{ formatDate(workout.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">{{ formatDuration(workout.duration) }}</div>
                <div class="text-xs text-gray-500">{{ workout.exercises.length }} exercises</div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No workouts completed yet</p>
            <p class="text-sm mt-1">Start your first workout to see progress here</p>
          </div>
        </div>

        <!-- Today's Nutrition Goals -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span class="bg-green-100 text-green-600 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
            Today's Nutrition
          </h3>

          <div class="space-y-4">
            <!-- Calories Goal -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Calories</span>
                <span class="text-sm text-gray-600">{{ todayCalories }}/{{ calorieGoal }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((todayCalories / calorieGoal) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Protein Goal -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Protein</span>
                <span class="text-sm text-gray-600">{{ todayProtein }}g/{{ proteinGoal }}g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((todayProtein / proteinGoal) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Carbs Goal -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Carbohydrates</span>
                <span class="text-sm text-gray-600">{{ todayCarbs }}g/{{ carbsGoal }}g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((todayCarbs / carbsGoal) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Fats Goal -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Fats</span>
                <span class="text-sm text-gray-600">{{ todayFats }}g/{{ fatsGoal }}g</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((todayFats / fatsGoal) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { usePlanStore } from '@/stores/planStore'
import { useRecentWorkoutStore } from '@/stores/recentWorkoutStore'
import { useExerciseStore } from '@/stores/exerciseStore'
import { useMealStore } from '@/stores/mealStore'
import { useAuthStore } from '@/stores/authStore'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'DashboardView',
  components: {
    Line
  },
  data() {
    return {
      // Nutrition goals - these could come from a settings store later
      calorieGoal: 2200,
      proteinGoal: 150,
      carbsGoal: 220,
      fatsGoal: 80,
      
      // Chart controls
      calorieChartPeriod: 7,
      selectedExercise: '',
      
      // Computed stats
      weeklyWorkouts: 0,
      lastWeekWorkouts: 0
    }
  },
  setup() {
    const planStore = usePlanStore()
    const recentWorkoutStore = useRecentWorkoutStore()
    const exerciseStore = useExerciseStore()
    const mealStore = useMealStore()
    const authStore = useAuthStore()

    return {
      planStore,
      recentWorkoutStore,
      exerciseStore,
      mealStore,
      authStore
    }
  },
  computed: {
    currentUser() {
      return this.authStore.currentUser
    },
    
    todayCalories() {
      return this.mealStore.currentCalories
    },
    
    todayProtein() {
      return this.mealStore.currentProteins
    },
    
    todayCarbs() {
      return this.mealStore.currentCarbohydrates
    },
    
    todayFats() {
      return this.mealStore.currentFats
    },
    
    totalExercises() {
      return this.planStore.plans.reduce((total, plan) => {
        return total + (plan.exercises ? plan.exercises.length : 0)
      }, 0)
    },
    
    calorieChartData() {
      const days = parseInt(this.calorieChartPeriod)
      const labels = []
      const data = []
      const goalLine = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        
        // Get actual calorie data for this date
        const dayCalories = this.getCaloriesForDate(date)
        data.push(dayCalories)
        goalLine.push(this.calorieGoal)
      }
      
      return {
        labels,
        datasets: [
          {
            label: 'Daily Calories',
            data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Goal',
            data: goalLine,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      }
    },
    
    calorieChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 1200
          }
        }
      }
    },
    
    weightProgressData() {
      if (!this.selectedExercise) return { labels: [], datasets: [] }
      
      // Get all workouts that contain the selected exercise
      const relevantWorkouts = this.recentWorkoutStore.recentWorkouts.filter(workout => {
        return workout.exercises && workout.exercises.some(exercise => 
          exercise._id === this.selectedExercise && 
          exercise.setData && 
          exercise.setData.length > 0 &&
          !exercise.skipped
        )
      }).sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
      
      if (relevantWorkouts.length === 0) {
        return { labels: [], datasets: [] }
      }
      
      const labels = []
      const maxWeights = []
      const avgWeights = []
      
      relevantWorkouts.forEach(workout => {
        const exercise = workout.exercises.find(ex => ex._id === this.selectedExercise)
        if (exercise && exercise.setData && exercise.setData.length > 0) {
          // Add workout date as label
          labels.push(new Date(workout.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }))
          
          // Calculate max weight for this workout
          const weights = exercise.setData
            .filter(set => set.weight && set.weight > 0)
            .map(set => Number(set.weight))
          
          if (weights.length > 0) {
            maxWeights.push(Math.max(...weights))
            avgWeights.push(Math.round(weights.reduce((sum, w) => sum + w, 0) / weights.length))
          } else {
            maxWeights.push(0)
            avgWeights.push(0)
          }
        }
      })
      
      const datasets = [
        {
          label: 'Max Weight (kg)',
          data: maxWeights,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: false
        }
      ]
      
      // Add average weight line if there's enough data variation
      if (avgWeights.length > 1 && Math.max(...avgWeights) - Math.min(...avgWeights) > 0) {
        datasets.push({
          label: 'Avg Weight (kg)',
          data: avgWeights,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          borderDash: [3, 3]
        })
      }
      
      return {
        labels,
        datasets
      }
    },
    
    weightProgressOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    }
  },
  
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
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
    },
    
    getCaloriesForDate(date) {
      const dateString = date.toDateString()
      const dayMeals = this.mealStore.meals.filter(meal => {
        if (!meal.lastModified) return false
        return new Date(meal.lastModified).toDateString() === dateString
      })
      
      return dayMeals.reduce((total, meal) => {
        return total + (Number(meal.calories) || 0)
      }, 0)
    },
    
    calculateWeeklyWorkouts() {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      this.weeklyWorkouts = this.recentWorkoutStore.recentWorkouts.filter(workout => 
        new Date(workout.date) > oneWeekAgo
      ).length

      this.lastWeekWorkouts = this.recentWorkoutStore.recentWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date)
        return workoutDate > twoWeeksAgo && workoutDate <= oneWeekAgo
      }).length
    },
    
    async loadAllData() {
      try {
        // Load data from all stores
        await Promise.all([
          this.planStore.callGetAllPlans(),
          this.recentWorkoutStore.callGetAllRecentWorkouts(),
          this.exerciseStore.callGetAllExercises(),
          this.mealStore.getAllMeals(),
          this.authStore.fetchUser()
        ])
        
        // Calculate weekly workout stats after data is loaded
        this.calculateWeeklyWorkouts()
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }
  },
  
  async mounted() {
    await this.loadAllData()
  },
  
  watch: {
    'recentWorkoutStore.recentWorkouts': {
      handler() {
        this.calculateWeeklyWorkouts()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.grid {
  display: grid;
}

/* Ensure charts are responsive */
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>
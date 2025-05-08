<template>
  <article class="px-3 md:px-5">
    <h3 class="text-[#555] border-b-2 border-[#eee] pb-2 mt-5 text-xl font-bold">
      {{ tablename }}
    </h3>
    <div class="mt-6 overflow-x-auto">
      <table
        v-if="exercises.length > 0"
        id="my"
        class="w-full my-0 mb-5 border-collapse border-spacing-0 bg-white rounded-lg overflow-hidden shadow-table min-w-[650px]"
      >
        <thead>
          <tr>
            <th
              class="bg-gradient-to-br from-[#888] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
            >
              Name
            </th>
            <th
              class="bg-gradient-to-br from-[#888] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
            >
              Difficulty Level
            </th>
            <th
              class="bg-gradient-to-br from-[#888] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
            >
              Tags
            </th>
            <th
              class="bg-gradient-to-br from-[#888] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
            >
              Intensity
            </th>
            <th
              class="bg-gradient-to-br from-[#888] to-custom-tablehead text-white font-semibold tracking-wider py-3 px-2 md:py-3.5 md:px-4 text-left"
            >
              Manage
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="exercise in exercises"
            :key="exercise.id"
            class="border-b border-custom-tableborder hover:bg-custom-tablehover"
          >
            <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.name }}</td>
            <td class="py-2 px-2 md:py-3 md:px-4 text-left">
              {{ exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1) }}
            </td>
            <td class="py-2 px-2 md:py-3 md:px-4 text-left">
              {{ exercise.tags.map(formatEntry).join(', ') }}
            </td>
            <td class="py-2 px-2 md:py-3 md:px-4 text-left">{{ exercise.intensity }}</td>
            <td class="py-2 px-2 md:py-3 md:px-4 text-center">
              <a
                v-if="tablename === 'My Exercises'"
                href="#edit"
                @click.prevent="requestEdit(exercise)"
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
                v-if="tablename === 'My Exercises'"
                href="#delete"
                @click.prevent="handleDeleteExercise(exercise.id, exercise.name)"
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
      <p v-if="exercises.length === 0">You have not created any exercises yet.</p>
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

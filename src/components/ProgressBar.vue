<template>
  <div class="w-full max-w-sm mx-auto text-center mt-5">
    <div class="w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-md">
      <div
        class="h-full bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-500 ease-in-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    <span class="mt-2 text-base font-semibold text-gray-700">{{ Math.round(progress) }}%</span>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      required: true,
    },
    toReach: {
      type: Number,
      required: true,
    },
  },
  computed: {
    progress() {
      if (this.toReach === 0) return 0
      return (this.current / this.toReach) * 100
    },
  },
}
</script>

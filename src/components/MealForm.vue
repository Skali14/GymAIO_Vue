<template>
        <section class="bg-white p-6 mx-auto rounded-xl max-w-3xl" id="meal-form">
            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label for="meal-name" class="font-bold">Name:</label>
                    <input type="text" id="meal-name"
                        :value="modelValue.name"
                        @input="updateField('name', $event.target.value)"
                        name="meal-name" placeholder="e.g. Spaghetti Bolognese" required class="w-full p-3 border border-gray-500 rounded-md text-base">
                </div>

      <div class="mb-4">
        <label for="meal-calories" class="font-bold">Calories:</label>
        <input
          type="number"
          id="meal-calories"
          :value="modelValue.calories"
          @input="updateField('calories', $event.target.value)"
          name="meal-calories"
          min="0"
          placeholder="e.g. 700"
          required
          class="w-full p-3 border border-gray-500 rounded-md text-base"
        />
      </div>

      <div class="mb-4">
        <label for="meal-proteins" class="font-bold">Proteins:</label>
        <input
          type="number"
          id="meal-proteins"
          :value="modelValue.proteins"
          @input="updateField('proteins', $event.target.value)"
          name="meal-proteins"
          min="0"
          placeholder="e.g. 35"
          class="w-full p-3 border border-gray-500 rounded-md text-base"
        />
      </div>

      <div class="mb-4">
        <label for="meal-carbohydrates" class="font-bold">Carbohydrates:</label>
        <input
          type="number"
          id="meal-carbohydrates"
          :value="modelValue.carbohydrates"
          @input="updateField('carbohydrates', $event.target.value)"
          name="meal-carbohydrates"
          min="0"
          placeholder="e.g. 120"
          class="w-full p-3 border border-gray-500 rounded-md text-base"
        />
      </div>

      <div class="mb-4">
        <label for="meal-fats" class="font-bold">Fats:</label>
        <input
          type="number"
          id="meal-fats"
          :value="modelValue.fats"
          @input="updateField('fats', $event.target.value)"
          name="meal-fats"
          min="0"
          placeholder="e.g. 25"
          class="w-full p-3 border border-gray-500 rounded-md text-base"
        />
      </div>

      <div class="mb-4">
        <label for="meal-vegetarian" class="flex items-center justify-start gap-3 font-bold"
          >Vegetarian:
          <input
            type="checkbox"
            id="meal-vegetarian"
            :checked="modelValue.vegetarian"
            @input="updateField('vegetarian', $event.target.checked)"
            name="meal-vegetarian"
            class="w-auto h-auto flex-shrink-0"
          />
        </label>
      </div>

      <div :class="isEditing ? 'flex gap-4' : ''">
        <button
          v-if="isEditing"
          type="button"
          @click="handleCancel"
          class="w-full p-3 bg-gray-500 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-blue-800 hover:scale-105 hover:border-2 hover:border-gray-200"
        >
          Cancel Edit
        </button>

        <button
          type="submit"
          :disabled="!modelValue.name"
          class="w-full p-3 bg-green-600 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-green-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {{ isEditing ? 'Confirm Edit' : 'Submit Meal' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'MealForm',
  props: {
    // Prop received from v-model="currentMeal" in parent
    modelValue: {
      type: Object,
      required: true,
    },
    // Prop to control display logic (title, button text)
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    // Event emitted for v-model updates
    'update:modelValue',
    // Custom events to signal actions to the parent
    'submit-meal',
    'cancel-edit',
  ],
  methods: {
    // Method to update a specific field and emit the update for v-model
    updateField(field, value) {
      // Create a *new* object copy with the updated field
      const updatedMeal = {
        ...this.modelValue, // Copy existing data
        [field]: value, // Update the specific field using computed property name
      }
      // Emit the required event for v-model with the new object
      this.$emit('update:modelValue', updatedMeal)
    },
    // Method triggered by form submission
    handleSubmit() {
      // Basic validation check (could be more extensive)
      if (!this.modelValue.name || this.modelValue.calories <= 0) {
        alert('Form validation failed within MealForm (Name and Calories required).')
        return
      }
      // Signal to the parent that the form is submitted
      this.$emit('submit-meal')
    },
    // Method triggered by the cancel button
    handleCancel() {
      // Signal to the parent that editing was cancelled
      this.$emit('cancel-edit')
    },
  },
}
</script>

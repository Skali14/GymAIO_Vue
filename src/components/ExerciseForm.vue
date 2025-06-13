<template>
  <section
    id="exercise-form"
    class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-4 lg:mb-0"
  >
    <h2 class="text-xl font-bold mb-6 text-gray-800 flex items-center">
      <span class="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </span>
      {{ isEditing ? 'Update Exercise' : 'Add Exercise' }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="exercise-name" class="block font-bold mb-2 text-gray-700">Name:</label>
        <input
          type="text"
          id="exercise-name"
          name="exercise-name"
          :value="modelValue.name"
          @input="updateField('name', $event.target.value)"
          required
          placeholder="e.g. Benchpress"
          class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
        />
      </div>

      <div class="mb-4">
        <label for="exercise-description" class="block font-bold mb-2 text-gray-700">Description:</label>
        <textarea
          id="exercise-description"
          name="exercise-description"
          :value="modelValue.description"
          @input="updateField('description', $event.target.value)"
          rows="4"
          placeholder="Enter exercise description here..."
          class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="exercise-tags" class="block font-bold mb-2 text-gray-700">
          Tags:
          <span class="font-normal text-sm text-gray-500 ml-2">(hold Ctrl/Cmd to select multiple)</span>
        </label>
        <select
          id="exercise-tags"
          name="exercise-tags"
          @change="updateField('tags', Array.from($event.target.selectedOptions).map((opt) => opt.value))"
          multiple
          class="w-full min-h-[120px] p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
        >
          <option value="pull" :selected="modelValue.tags.includes('pull')" class="py-2">Pull</option>
          <option value="push" :selected="modelValue.tags.includes('push')" class="py-2">Push</option>
          <option value="upper-body" :selected="modelValue.tags.includes('upper-body')" class="py-2">Upper Body</option>
          <option value="chest" :selected="modelValue.tags.includes('chest')" class="py-2">Chest</option>
          <option value="back" :selected="modelValue.tags.includes('back')" class="py-2">Back</option>
          <option value="shoulder" :selected="modelValue.tags.includes('shoulder')" class="py-2">Shoulder</option>
          <option value="legs" :selected="modelValue.tags.includes('legs')" class="py-2">Legs</option>
          <option value="arms" :selected="modelValue.tags.includes('arms')" class="py-2">Arms</option>
          <option value="core" :selected="modelValue.tags.includes('core')" class="py-2">Core</option>
          <option value="cardio" :selected="modelValue.tags.includes('cardio')" class="py-2">Cardio</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="exercise-difficulty" class="block font-bold mb-2 text-gray-700">Difficulty Level:</label>
        <select
          id="exercise-difficulty"
          name="exercise-difficulty"
          :value="modelValue.difficulty"
          @change="updateField('difficulty', $event.target.value)"
          class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="exercise-form-explanation" class="block font-bold mb-2 text-gray-700">Upload Exercise Image:</label>
        <input
          type="file"
          id="exercise-form-explanation"
          :key="fileInputKey"
          name="exercise-form-explanation"
          accept="image/*"
          @change="uploadImage($event)"
          class="w-full p-3 border border-gray-500 rounded-md text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
        />
      </div>

      <div class="mb-6">
        <label for="exercise-intensity" class="block font-bold mb-2 text-gray-700">
          Intensity: {{ modelValue.intensity }}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          id="exercise-intensity"
          :value="modelValue.intensity"
          @change="updateField('intensity', $event.target.value)"
          name="exercise-intensity"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div class="flex justify-between text-sm text-gray-500 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div :class="isEditing ? 'flex gap-4' : ''">
        <button
          type="button"
          v-if="isEditing"
          @click="handleCancel"
          class="w-full p-3 bg-gray-500 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-gray-600 hover:scale-105"
        >
          Cancel Edit
        </button>

        <button
          type="submit"
          :disabled="!modelValue.name"
          class="w-full p-3 bg-green-600 text-white cursor-pointer border-none rounded-md transition-all duration-300 font-bold hover:bg-green-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {{ isEditing ? 'Update Exercise' : 'Add Exercise' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'ExerciseForm',
  props: {
    // Prop received from v-model="currentExercise" in parent
    modelValue: {
      type: Object,
      required: true,
    },
    // Prop to control display logic (title, button text)
    isEditing: {
      type: Boolean,
      required: true,
    },
    fileInputKey: {
      type: Number,
      required: true,
    },
  },
  emits: [
    // Event emitted for v-model updates
    'update:modelValue',
    // Custom events to signal actions to the parent
    'submit-exercise',
    'cancel-edit',
  ],
  methods: {
    // Method to update a specific field and emit the update for v-model
    updateField(field, value) {
      // Create a *new* object copy with the updated field
      const updatedExercise = {
        ...this.modelValue, // Copy existing data
        [field]: value, // Update the specific field using computed property name
      }
      // Emit the required event for v-model with the new object
      this.$emit('update:modelValue', updatedExercise)
    },
    uploadImage(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          // Calculate aspect ratio
          const aspectRatio = width / height;

          // Resize based on the larger dimension
          if (width > height) {
            if (width > MAX_WIDTH) {
              width = MAX_WIDTH;
              height = width / aspectRatio;
            }
          } else {
            if (height > MAX_HEIGHT) {
              height = MAX_HEIGHT;
              width = height * aspectRatio;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and resize image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
          this.updateField('image', resizedImage);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.updateField('image', null);
    },
    // Method triggered by form submission
    handleSubmit() {
      // Basic validation check (could be more extensive)
      if (!this.modelValue.name) {
        alert('Form validation failed within ExerciseForm (Name required).') // Or handle more gracefully
        return
      }
      // Signal to the parent that the form is submitted
      this.$emit('submit-exercise')
    },
    // Method triggered by the cancel button
    handleCancel() {
      // Signal to the parent that editing was cancelled
      this.$emit('cancel-edit')
    },
  },
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

select[multiple] option:checked {
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  margin: 2px;
}

select[multiple] option {
  padding: 8px 12px;
  margin: 1px;
  border-radius: 4px;
}
</style>

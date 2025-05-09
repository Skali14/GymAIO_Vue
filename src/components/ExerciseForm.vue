<template>
  <section
    id="exercise-form"
    class="bg-custom-formbg rounded-xl shadow-section overflow-hidden mb-4 lg:mb-0"
  >
    <h2
      class="bg-gradient-to-br from-[#888] to-custom-formheader text-white m-0 py-3 px-4 md:py-4 md:px-5 text-2xl md:text-3xl tracking-wider font-semibold"
    >
      {{ isEditing ? 'Update an exercise' : 'Create a new exercise' }}
    </h2>
    <form
      class="bg-white p-4 md:p-6 m-0 w-full box-border rounded-none shadow-none"
      @submit.prevent="handleSubmit"
    >
      <div class="mb-5">
        <label for="exercise-name" class="block font-bold mb-2 text-[#555] text-sm"
          ><strong>Name:</strong></label
        >
        <input
          type="text"
          id="exercise-name"
          name="exercise-name"
          :value="modelValue.name"
          @input="updateField('name', $event.target.value)"
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
          :value="modelValue.description"
          @input="updateField('description', $event.target.value)"
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
          @change="
            updateField(
              'tags',
              Array.from($event.target.selectedOptions).map((opt) => opt.value),
            )
          "
          multiple
          class="w-full h-auto min-h-[120px] p-2.5 bg-custom-inputbg border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
        >
          <option
            value="pull"
            :selected="modelValue.tags.includes('pull')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Pull
          </option>
          <option
            value="push"
            :selected="modelValue.tags.includes('push')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Push
          </option>
          <option
            value="upper-body"
            :selected="modelValue.tags.includes('upper-body')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Upper Body
          </option>
          <option
            value="chest"
            :selected="modelValue.tags.includes('chest')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Chest
          </option>
          <option
            value="back"
            :selected="modelValue.tags.includes('back')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Back
          </option>
          <option
            value="shoulder"
            :selected="modelValue.tags.includes('shoulder')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Shoulder
          </option>
          <option
            value="legs"
            :selected="modelValue.tags.includes('legs')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Legs
          </option>
          <option
            value="arms"
            :selected="modelValue.tags.includes('arms')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Arms
          </option>
          <option
            value="core"
            :selected="modelValue.tags.includes('core')"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Core
          </option>
          <option
            value="cardio"
            :selected="modelValue.tags.includes('cardio')"
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
          :value="modelValue.difficulty"
          @change="updateField('difficulty', $event.target.value)"
          class="w-full h-auto py-2.5 px-3 bg-custom-inputbg border border-custom-inputborder rounded-md box-border text-sm transition-all duration-300 focus:border-[#888] focus:shadow-md focus:outline-none"
        >
          <option value="beginner" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
            Beginner
          </option>
          <option
            value="intermediate"
            class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover"
          >
            Intermediate
          </option>
          <option value="advanced" class="py-2 px-2.5 mb-0.5 rounded hover:bg-custom-optionhover">
            Advanced
          </option>
        </select>
      </div>

      <div class="mb-5">
        <label for="exercise-form-explanation" class="block font-bold mb-2 text-[#555] text-sm"
          ><strong>Upload Exercise Image:</strong></label
        >
        <input
          type="file"
          id="exercise-form-explanation"
          :key="fileInputKey"
          name="exercise-form-explanation"
          accept="image/*"
          @change="updateField('image', $event.target.files[0])"
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
          id="exercise-intensity"
          :value="modelValue.intensity"
          @change="updateField('intensity', $event.target.value)"
          name="exercise-intensity"
          class="w-full h-1.5 bg-[#ddd] appearance-none rounded-full cursor-pointer"
        />
      </div>

      <div :class="isEditing ? 'flex gap-4' : ''">
        <button
          type="button"
          v-if="isEditing"
          @click="handleCancel"
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

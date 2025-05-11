<script setup></script>

<template>
       <main class="bg-[#f4f4f4] text-[#333] font-sans  p-5">
          <!-- My Goals -->
          <MealForm
            v-model="currentMeal"
            :is-editing="isEditing"
            @submit-meal="handleFormSubmit"
            @cancel-edit="cancelEdit"
          />

          <section class="bg-white p-6 my-5 mx-auto rounded-xl shadow-md max-w-3xl">
            <h2 class="text-center text-gray-800 font-bold mb-4 text-2xl">My Daily Goals</h2>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Name</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Goal</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Current</th>
                    <th class="p-3 bg-gray-500 text-white border-b border-gray-300">Manage Goal</th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="hover:bg-gray-200">
                    <td class="p-3 border-b border-gray-300 text-center">Calories (kcal)</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div v-if="editingGoalType === 'calories'">
                        <input 
                          type="number" 
                          v-model.number="editingGoalValue" 
                          min="0" 
                          max="10000" 
                          class="w-20 p-1 border border-gray-500 rounded-md text-base text-center"
                        >
                      </div>
                      <div v-else>{{goal.calories}}</div>
                    </td>
                    <td class="p-3 border-b border-gray-300 text-center">{{this.mealStore.currentCalories}}</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div class="inline-flex justify-center gap-2 items-center">
                        <a href="#" @click.prevent="startEditGoal('calories', goal.calories)" v-if="editingGoalType !== 'calories'">
                          <img src="/edit.svg" alt="Modify" width="16" height="16">
                        </a>
                        <a href="#" @click.prevent="saveGoal('calories')" v-if="editingGoalType === 'calories'">
                          <span class="text-green-600 font-bold">✓</span>
                        </a>
                        <a href="#" @click.prevent="cancelEditGoal()" v-if="editingGoalType === 'calories'">
                          <span class="text-red-600 font-bold">✗</span>
                        </a>
                        <a href="#" @click.prevent="deleteGoal('calories')"><img src="/trash.svg" alt="Delete" width="16" height="16"></a>
                      </div>
                    </td>
                  </tr>
                
                  <tr class="bg-gray-100 hover:bg-gray-200">
                    <td class="p-3 border-b border-gray-300 text-center">Proteins (g)</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div v-if="editingGoalType === 'proteins'">
                        <input 
                          type="number" 
                          v-model.number="editingGoalValue" 
                          min="0" 
                          class="w-20 p-1 border border-gray-500 rounded-md text-base text-center"
                        >
                      </div>
                      <div v-else>{{goal.proteins}}</div>
                    </td>
                    <td class="p-3 border-b border-gray-300 text-center">{{this.mealStore.currentProteins}}</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div class="inline-flex justify-center gap-2 items-center">
                        <a href="#" @click.prevent="startEditGoal('proteins', goal.proteins)" v-if="editingGoalType !== 'proteins'">
                          <img src="/edit.svg" alt="Modify" width="16" height="16">
                        </a>
                        <a href="#" @click.prevent="saveGoal('proteins')" v-if="editingGoalType === 'proteins'">
                          <span class="text-green-600 font-bold">✓</span>
                        </a>
                        <a href="#" @click.prevent="cancelEditGoal()" v-if="editingGoalType === 'proteins'">
                          <span class="text-red-600 font-bold">✗</span>
                        </a>
                        <a href="#" @click.prevent="deleteGoal('proteins')"><img src="/trash.svg" alt="Delete" width="16" height="16"></a>
                      </div>
                    </td>
                  </tr>
                
                  <tr class="hover:bg-gray-200">
                    <td class="p-3 border-b border-gray-300 text-center">Carbohydrates (g)</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div v-if="editingGoalType === 'carbohydrates'">
                        <input 
                          type="number" 
                          v-model.number="editingGoalValue" 
                          min="0" 
                          class="w-20 p-1 border border-gray-500 rounded-md text-base text-center"
                        >
                      </div>
                      <div v-else>{{goal.carbohydrates}}</div>
                    </td>
                    <td class="p-3 border-b border-gray-300 text-center">{{this.mealStore.currentCarbohydrates}}</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div class="inline-flex justify-center gap-2 items-center">
                        <a href="#" @click.prevent="startEditGoal('carbohydrates', goal.carbohydrates)" v-if="editingGoalType !== 'carbohydrates'">
                          <img src="/edit.svg" alt="Modify" width="16" height="16">
                        </a>
                        <a href="#" @click.prevent="saveGoal('carbohydrates')" v-if="editingGoalType === 'carbohydrates'">
                          <span class="text-green-600 font-bold">✓</span>
                        </a>
                        <a href="#" @click.prevent="cancelEditGoal()" v-if="editingGoalType === 'carbohydrates'">
                          <span class="text-red-600 font-bold">✗</span>
                        </a>
                        <a href="#" @click.prevent="deleteGoal('carbohydrates')"><img src="/trash.svg" alt="Delete" width="16" height="16"></a>
                      </div>
                    </td>
                  </tr>
                
                  <tr class="bg-gray-100 hover:bg-gray-200">
                    <td class="p-3 border-b border-gray-300 text-center">Fats (g)</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div v-if="editingGoalType === 'fats'">
                        <input 
                          type="number" 
                          v-model.number="editingGoalValue" 
                          min="0" 
                          class="w-20 p-1 border border-gray-500 rounded-md text-base text-center"
                        >
                      </div>
                      <div v-else>{{goal.fats}}</div>
                    </td>
                    <td class="p-3 border-b border-gray-300 text-center">{{this.mealStore.currentFats}}</td>
                    <td class="p-3 border-b border-gray-300 text-center">
                      <div class="inline-flex justify-center gap-2 items-center">
                        <a href="#" @click.prevent="startEditGoal('fats', goal.fats)" v-if="editingGoalType !== 'fats'">
                          <img src="/edit.svg" alt="Modify" width="16" height="16">
                        </a>
                        <a href="#" @click.prevent="saveGoal('fats')" v-if="editingGoalType === 'fats'">
                          <span class="text-green-600 font-bold">✓</span>
                        </a>
                        <a href="#" @click.prevent="cancelEditGoal()" v-if="editingGoalType === 'fats'">
                          <span class="text-red-600 font-bold">✗</span>
                        </a>
                        <a href="#" @click.prevent="deleteGoal('fats')"><img src="/trash.svg" alt="Delete" width="16" height="16"></a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Current Meals Today -->
           <MealTable
            :meals="mealStore.allMeals"
            @edit-meal="(meal) => startEdit(meal)"
            @meal-deleted="(id) => handleMealDeleted(id)"
           />

        </main>
</template>

<script>
  import MealForm from '@/components/MealForm.vue'
  import MealTable from '@/components/MealTable.vue'
  import { mapStores } from 'pinia'
  import { useMealStore, createEmptyMeal } from '@/stores/mealStore.js'

  export default {
      name: 'CalorieView',
      components: {MealForm, MealTable},
      data() { return {
          goal: {
            calories: 2500,
            proteins: 180,
            carbohydrates: 300,
            fats: 80
          },
          // Track the goal being edited
          editingGoalType: null,
          editingGoalValue: 0,
          
          currentMeal: createEmptyMeal(),
          isEditing: false,
      } },
      computed: {
            ...mapStores(useMealStore),
      },
      methods: {
          handleFormSubmit() {
            if (this.isEditing) {
              this.mealStore.updateMeal({ ...this.currentMeal }) // Access action via mealStore
            } else {
              this.mealStore.addMeal({ ...this.currentMeal }) // Access action via mealStore
            }
            this.resetForm()
          },
          startEdit(mealToEdit) {
              this.currentMeal = {...mealToEdit};
              this.isEditing = true;
              console.log('Started editing:', mealToEdit.name);
              document.getElementById('meal-form').scrollIntoView();
          },
          cancelEdit() {
              this.resetForm();
              console.log('Cancelled edit.');
          },
                    // New method to handle the event emitted from DishTable after deletion
          handleMealDeleted(deletedMealId) {
            console.log('CaloriePage: Received meal-deleted event for ID', deletedMealId)
            // Check if the deleted dish is the one currently being edited
            if (this.isEditing && this.currentMeal.id === deletedMealId) {
              console.log('CaloriePage: The currently edited meal was deleted. Resetting form.')
              this.resetForm()
            }
          },
          resetForm() {
              this.currentMeal = createEmptyMeal();
              this.isEditing = false;
          },
          
          // Goal management methods
          startEditGoal(type, value) {
              this.editingGoalType = type;
              this.editingGoalValue = value;
          },
          saveGoal(type) {
              if (this.editingGoalValue < 0) {
                  alert('Goal value cannot be negative.');
                  return;
              }
              
              // Update goal value
              this.goal[type] = this.editingGoalValue;
              console.log(`Updated ${type} goal to:`, this.editingGoalValue);
              
              // Reset editing state
              this.editingGoalType = null;
              this.editingGoalValue = 0;
          },
          cancelEditGoal() {
              this.editingGoalType = null;
              this.editingGoalValue = 0;
          },
          deleteGoal(type) {
              if (confirm(`Are you sure you want to delete the ${type} goal?`)) {
                  this.goal[type] = 0;
                  console.log(`Deleted ${type} goal.`);
              }
          }
      }
  };
</script>

<style scoped></style>

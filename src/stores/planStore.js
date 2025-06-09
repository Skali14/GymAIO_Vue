import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient';  // import the configured axios instance


export function createEmptyPlan() {
  return {
      _id: null,
      name: '',
      description: '',
      exercises: []
  }
}

export const usePlanStore = defineStore('plan', {
  name: 'PlanPage',
  state: () => ({
    plans: [],
  }),
  actions: {

    async callGetAllPlans() {
      try {
        const response = await apiClient.get('/api/plans');
        this.plans = response.data.plans;
      } catch (error) {
        this.handleApiError(error, 'Failed to fetch plans');
      }
    },

    async addPlan(planData) {
      if (!planData.name) {
        alert('Please fill in at least the name.')
        return
      }
      try {
        const newPlan = {
          ...planData,
        }
        const response = await apiClient.post('/api/plans', newPlan);
        this.plans.push(response.data.plan)
        console.log('Added new plan:', response.data.plan)
      } catch (error) {
        this.handleApiError(error, 'Failed to add plan');
      }

    },

    async updatePlan(updatedPlanData) {
      const index = this.plans.findIndex((plan) => plan._id === updatedPlanData._id)
      if (index !== -1) {
        try {
          const response = await apiClient.put(`/api/plans/${updatedPlanData._id}`, updatedPlanData);
          this.plans.splice(index, 1, { ...response.data.updatedPlan })
          console.log('Updated plan:', response.data.updatedPlan.name)
        } catch (error) {
          this.handleApiError(error, 'Failed to update plan');
        }

      } else {
        console.warn('PlanStore: Plan not found for update - ID:', updatedPlanData._id)
      }
    },

    async deletePlan(planId) {
      const initialLength = this.plans.length
      const planName = this.plans.find((p) => p._id === planId)?.name || 'Unknown Plan'
      try {
        await apiClient.delete(`/api/plans/${planId}`)
        this.plans = this.plans.filter((plan) => plan._id !== planId)
        if (this.plans.length < initialLength) {
          console.log('PlanStore: Deleted plan - Name:', planName)
        } else {
          console.warn('PlanStore: Plan not found for deletion - ID:', planId)
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to delete plan')
      }

    },

    handleApiError(error, contextMessage = 'An API error occurred') {
      console.error(contextMessage, error); // Log the full error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            this.latestErrorMessage = 'Bad Request: ' + error.response.data.message;
            break;
          case 401:
            this.latestErrorMessage = 'Unauthorized: ' + error.response.data.message;
            break;
          case 403:
            this.latestErrorMessage = 'Forbidden: ' + error.response.data.message;
            break;
          case 404:
            this.latestErrorMessage = 'Not Found: ' + error.response.data.message;
            break;
          default:
            this.latestErrorMessage = 'An error occurred: ' + error.response.data.message;
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        this.latestErrorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        this.latestErrorMessage = error.message || 'Error setting up the request.';
      }
    },
  },
})

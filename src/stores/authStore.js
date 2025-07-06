import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient';  // import the configured axios instance

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        token: localStorage.getItem('token') || null
    }),

    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        currentUser: (state) => state.user,
        isAdmin: (state) => state.user?.admin || false
    },

    actions: {
        async login(email, password) {
            console.log("Logging in, in authStore")
            const response = await apiClient.post('/api/login', { email: email, password: password });
            this.token = response.data.token;
            localStorage.setItem('token', this.token); // store token after login
            await this.fetchUser()
        },

        async fetchUser() {
            try {
                const response = await apiClient.get("/api/user")
                this.user = response.data.user
                this.isAuthenticated = true
            } catch (error) {
                //no user logged in or token expired
                this.handleApiError(error, 'Failed to fetch user');
                this.logout()
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
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
    }

})

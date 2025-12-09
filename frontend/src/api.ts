/**
 * API Service for NutriMind Frontend
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error);
    
    if (error.response) {
      const { data } = error.response;
      throw new Error(data.error || data.detail || 'An error occurred');
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw error;
    }
  }
);

// Types
export interface RecipeSearchRequest {
  ingredients: string[];
  dietary_restrictions?: string[];
  meal_type?: string | null;
  cuisine?: string | null;
  cooking_time?: number | null;
  servings?: number;
}

export interface MealPlanRequest {
  dietary_restrictions?: string[];
  calorie_target?: number;
  meals_per_day?: number;
  days?: number;
  allergies?: string[];
  preferences?: string;
}

// API Methods

/**
 * Search for recipes based on ingredients
 */
export const searchRecipes = async (searchParams: RecipeSearchRequest) => {
  const response = await apiClient.post('/recipes/search', searchParams);
  return response.data;
};

/**
 * Generate a personalized meal plan
 */
export const generateMealPlan = async (preferences: MealPlanRequest) => {
  const response = await apiClient.post('/meal-plan', preferences);
  return response.data;
};

/**
 * Chat with AI assistant
 */
export const chatWithAI = async (message: string, context: any[] | null = null) => {
  const response = await apiClient.post('/chat', { message, context });
  return response.data;
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;

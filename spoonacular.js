// spoonacular.js

import axios from 'axios';

const SPOONACULAR_API_KEY = '8862a901e3984a9f96b81e52d1f84e36'; // Replace with your Spoonacular API Key

export const getRecipes = async (ingredients) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
      params: {
        ingredients: ingredients.join(','),
        number: 10, // Number of recipes to return
        ranking: 1,  // Prioritize recipes with the most matching ingredients
        ignorePantry: true, // Ignore common pantry items
        apiKey: SPOONACULAR_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

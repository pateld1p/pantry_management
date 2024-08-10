import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export const getRecipes = async (ingredients) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
      params: {
        ingredients: ingredients.join(','),
        number: 10,
        ranking: 1,
        ignorePantry: true,
        apiKey: SPOONACULAR_API_KEY, // Ensure the key is passed here
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};
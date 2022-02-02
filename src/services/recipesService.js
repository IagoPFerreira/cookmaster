const model = require('../models/recipesModel');

const newRecipe = async ({ name, ingredients, preparation }) => {
  if (!name || !ingredients || !preparation) {
    return ({ status: 400, message: 'Invalid entries. Try again.' });
  }

  const recipe = await model.newRecipe(name, ingredients, preparation);

  return recipe;
};

const getRecipes = async () => model.getRecipes();

const getRecipe = async (id) => {
  const recipe = await model.getRecipe(id);  

  if (recipe === 'invalid id') return ({ status: 404, message: 'invalid id' });

  return recipe;
};

module.exports = {
  newRecipe,
  getRecipes,
  getRecipe,
};
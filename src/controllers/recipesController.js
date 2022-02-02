const service = require('../services/recipesService');

const newRecipe = async (req, res) => {
  const recipe = await service.newRecipe(req.body);

  if (recipe.status) {
    return res.status(recipe.status).json({ message: recipe.message });
  }
  return res.status(201).json({ recipe });
};

const getRecipes = async (_req, res) => {
  const recipe = await service.getRecipes();

  if (recipe.length === 0) return res.status(404).json({ message: 'No registered recipe.' });

  return res.status(200).json(recipe);
};

module.exports = {
  newRecipe,
  getRecipes,
};
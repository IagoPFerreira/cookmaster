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

const getRecipe = async (req, res) => {
  const recipe = await service.getRecipe(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: 'recipe not found' });
  }

  if (recipe.message) return res.status(recipe.status).json({ message: recipe.message });

  return res.status(200).json(recipe);
};

const editRecipe = async (req, res) => {
  const { params: { id }, body } = req;

  const recipe = await service.editRecipe(id, body);

  return res.status(200).json(recipe);
};

const deleteRecipe = async (req, res) => {
  const { params: { id }, user: { role } } = req;

  if (role !== 'admin') {
    return res.status(401).json({ message: 'only admins can delete recipes' });
  }

  const recipe = await service.getRecipe(id);

  if (!recipe) {
    return res.status(404).json({ message: 'recipe not found' });
  }
  
  if (recipe.message) return res.status(recipe.status).json({ message: recipe.message });

  await service.deleteRecipe(id);

  return res.status(204).json({});
};

module.exports = {
  newRecipe,
  getRecipes,
  getRecipe,
  editRecipe,
  deleteRecipe,
};
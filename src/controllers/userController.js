const service = require('../services/userService');

const createUser = async (req, res) => {
  const { body } = req;

  const newUser = await service.createUser(body);

  if (newUser.err) return res.status(newUser.status).json({ message: newUser.message });

  return res.status(201).json(newUser);
};

module.exports = {
  createUser,
};
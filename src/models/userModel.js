const connection = require('./connection');

const coll = 'users';

const createUser = async (name, password, email, role) => {
  const newUser = await connection()
    .then((db) => db.collection(coll).insert({ name, password, email, role }))
    .then((result) => {
      const { password: _, ...userWithoutPassword } = result.ops[0];
      return { user: userWithoutPassword };
    });

  return newUser;
};

module.exports = {
  createUser,
};
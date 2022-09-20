// env import
require('dotenv').config();
const secret = process.env.JWT_SECRET;

// libs imports
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.status(401);
    res.json({ message: 'Parâmetro authorization não informado!' });
    return;
  }

  const tokenToBeAuthenticated = authorization.split(' ')[1];

  jwt.verify(tokenToBeAuthenticated, secret, (error, data) => {
    if (error) {
      res.status(401);
      res.json({ message: 'Usuário sem permissão de acesso!' });
      return;
    }

    res.status(200);
    req.loggedUserEmail = { email: data.email };
    next();
  });
};

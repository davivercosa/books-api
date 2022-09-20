// models imports
const UsersModel = require('../models/UsersModel');
const PasswordTokenModel = require('../models/PasswordTokenModel');

// env import
require('dotenv').config();
const secret = process.env.JWT_SECRET;

// services and libs imports
const Mailer = require('../services/SendEmail');
const jwt = require('jsonwebtoken');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (name === undefined) {
      res.status(400);
      res.json({ message: 'O campo nome deve ser informado!' });
      return;
    }

    if (email === undefined) {
      res.status(400);
      res.json({ message: 'O campo email deve ser informado!' });
      return;
    }

    if (password === undefined) {
      res.status(400);
      res.json({ message: 'O campo senha deve ser informado!' });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro name deve ser do tipo string!' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro email deve ser do tipo string!' });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro password deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(email);

    if (resp.status === true) {
      res.status(406);
      res.json({ message: 'E-mail já cadastrado na base de dados!' });
      return;
    }

    await UsersModel.create(name, email, password);
    res.status(200);
    res.json({ message: 'Usuário cadastrado com sucesso!' });
  }

  async authentication(req, res) {
    const { email, password } = req.body;

    if (email === undefined) {
      res.status(400);
      res.json({ message: 'Campo e-mail deve ser informado!' });
      return;
    }

    if (password === undefined) {
      res.status(400);
      res.json({ message: 'Campo senha deve ser informado!' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400);
      res.json({ messgae: 'O parâmetro email deve ser do tipo string!' });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400);
      res.json({ messgae: 'O parâmetro password deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(email);

    if (resp === false) {
      res.status(404);
      res.json({ message: 'E-mail não encontrado na base de dados!' });
      return;
    }

    const response = await UsersModel.isPasswordValid(email, password);

    if (response === false) {
      res.status(404);
      res.json({
        message: 'A senha informada está incorreta. Tente novamente!',
      });
      return;
    }

    jwt.sign(
      { email: resp.user.email },
      secret,
      { expiresIn: '48h' },
      (error, token) => {
        if (error) {
          res.status(500);
          res.json({
            message:
              'Erro interno. Para mais detalhes, por favor, entre em contato com o suporte!',
          });
          return;
        }

        res.status(200);
        res.json({
          message: `Olá, ${resp.user.name}! Lembre-se: Quando os pés estão corretos, todo o resto nos acompanha. - O leão, a feiticeira e o guarda-roupa - C. S. Lewis`,
          token: token,
        });
      },
    );
  }

  async update(req, res) {
    const { name, email, password } = req.body;

    if (name === undefined) {
      res.status(400);
      res.json({ message: 'O campo nome deve ser informado!' });
      return;
    }

    if (email === undefined) {
      res.status(400);
      res.json({ message: 'O campo email deve ser informado!' });
      return;
    }

    if (password === undefined) {
      res.status(400);
      res.json({ message: 'O campo senha deve ser informado!' });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro name deve ser do tipo string!' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro email deve ser do tipo string!' });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro password deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(email);

    if (resp === false) {
      res.status(404);
      res.json({ message: 'E-mail não cadastrado na base de dados!' });
      return;
    }

    await UsersModel.update(name, email, password);
    res.status(200);
    res.json({ message: 'Informações do usuário atualizadas com sucesso!' });
  }

  async delete(req, res) {
    const { email } = req.body;

    if (email === undefined) {
      res.status(400);
      res.json({ message: 'O campo email deve ser informado!' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro email deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(email);

    if (resp === false) {
      res.status(404);
      res.json({ message: 'E-mail não cadastrado na base de dados!' });
      return;
    }

    await UsersModel.delete(email);
    res.status(200);
    res.json({ message: 'Usuário deletado com sucesso!' });
  }

  async passwordToken(req, res) {
    const { email } = req.body;

    if (email === undefined) {
      res.status(400);
      res.json({ message: 'O campo email deve ser informado!' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400);
      res.json({ message: 'Parâmetro email deve ser do tipo string!' });
      return;
    }

    const resp = await UsersModel.isEmailAlreadyRegistered(email);

    if (resp === false) {
      res.status(404);
      res.json({ message: 'E-mail não cadastrado na base de dados!' });
      return;
    }

    const passwordToken = await PasswordTokenModel.create(resp.user);

    await Mailer(email, passwordToken);

    res.status(200);
    res.json({
      messasge:
        'Por favor, verifique o códido que o Books gerou para você no seu e-mail',
    });
  }

  async updatePassword(req, res) {
    const { newPassword, passwordToken } = req.body;

    if (newPassword === undefined) {
      res.status(400);
      res.json({ message: 'O campo nova senha deve ser informado!' });
      return;
    }

    if (passwordToken === undefined) {
      res.status(400);
      res.json({ message: 'O campo token deve ser informado!' });
      return;
    }

    if (typeof newPassword !== 'string') {
      res.status(400);
      res.json({ message: 'O parâmetro newPassword deve ser do tipo string!' });
      return;
    }

    if (typeof passwordToken !== 'string') {
      res.status(400);
      res.json({
        message: 'O parâmetro passwordToken deve ser do tipo string!',
      });
      return;
    }

    const resp = await PasswordTokenModel.exist(passwordToken);

    console.log(resp.tokenInfo.status);

    if (resp === false) {
      res.status(404);
      res.json({ message: 'Token inválido!' });
      return;
    }

    if (resp.tokenInfo.status !== 0) {
      res.status(401);
      res.json({ message: 'Token expirado!' });
      return;
    }

    await PasswordTokenModel.setStatus(passwordToken);

    await UsersModel.changePassword(newPassword, resp.tokenInfo.user_id);

    res.status(200);
    res.json({ message: 'Senha alterada com sucesso!' });
  }
}

module.exports = new UsersController();

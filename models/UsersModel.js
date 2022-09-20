// database connection import
const db = require('../database/connection');

// libs imports
const bcrypt = require('bcrypt');

class UsersModel {
  async isEmailAlreadyRegistered(email) {
    try {
      const resp = await db('users').select('*').where({ email: email });
      if (resp.length === 0) {
        return false;
      }

      return { status: true, user: resp[0] };
    } catch (error) {
      console.log(error);
    }
  }

  async isPasswordValid(email, password) {
    try {
      const hash = await db('users').select('password').where({ email: email });
      const result = await bcrypt.compare(password, hash[0].password);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async create(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 10);

      await db('users').insert({
        name: name,
        email: email,
        password: hash,
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async update(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 10);

      await db('users')
        .update({ name: name, email: email, password: hash })
        .where({ email: email });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(email) {
    try {
      await db('users').del().where({ email: email });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(newPassword, userId) {
    try {
      const hash = await bcrypt.hash(newPassword, 10);

      await db('users').update({ password: hash }).where({ id: userId });

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UsersModel();

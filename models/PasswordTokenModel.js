// database connection import
const db = require('../database/connection');

// libs imports
const { v4: uuidv4 } = require('uuid');

class PasswordTokenModel {
  async create(user) {
    try {
      const token = uuidv4();

      await db('password_tokens').insert({ token: token, user_id: user.id });
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async exist(token) {
    try {
      const resp = await db('password_tokens')
        .select('*')
        .where({ token: token });

      if (resp.length === 0) {
        return false;
      }

      return { status: true, tokenInfo: resp[0] };
    } catch (error) {
      console.log(error);
    }
  }

  async setStatus(token) {
    try {
      await db('password_tokens').update({ status: 1 }).where({ token: token });

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new PasswordTokenModel();

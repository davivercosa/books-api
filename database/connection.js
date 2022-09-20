const knex = require('knex');
const config = require('../knexfile');

const db = knex(config);

const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = db;

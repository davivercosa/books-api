exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 255);
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.integer('role').defaultTo(0, { constraintName: 'df_user_role' });
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};

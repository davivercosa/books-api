exports.up = function (knex) {
  return knex.schema.createTable('password_tokens', (table) => {
    table.increments('id').primary();
    table.string('token', 255).notNullable();
    table.integer('user_id').unsigned().notNullable();
    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE'),
      table
        .integer('status')
        .defaultTo(0, { constraintName: 'df_token_status' });
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('password_tokens');
};

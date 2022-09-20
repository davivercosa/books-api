exports.up = function (knex) {
  return knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('description', 255).notNullable();
    table.string('author', 255).notNullable();
    table.string('rate').notNullable();
    table.string('release_year').notNullable();
    table.string('cover_path').notNullable;
    table.integer('user_id').unsigned().notNullable();
    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE'),
      table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('books');
};

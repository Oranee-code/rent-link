exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary()
    table.integer('sender_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('receiver_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('property_id').references('id').inTable('properties').onDelete('CASCADE')
    table.text('content').notNullable()
    table.enum('message_type', ['text', 'image', 'document']).defaultTo('text')
    table.boolean('is_read').defaultTo(false)
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('messages')
} 
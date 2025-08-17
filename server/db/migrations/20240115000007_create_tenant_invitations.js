exports.up = function (knex) {
  return knex.schema.createTable('tenant_invitations', (table) => {
    table.increments('id').primary()
    table.integer('landlord_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('email').notNullable()
    table.text('message')
    table.integer('property_id').references('id').inTable('properties').onDelete('CASCADE')
    table.integer('unit_id').references('id').inTable('units').onDelete('CASCADE')
    table.integer('tenant_id').references('id').inTable('users').onDelete('SET NULL')
    table.enum('status', ['pending', 'accepted', 'expired', 'cancelled']).defaultTo('pending')
    table.timestamp('expires_at')
    table.timestamp('accepted_at')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tenant_invitations')
} 
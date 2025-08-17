exports.up = function (knex) {
  return knex.schema.createTable('maintenance_requests', (table) => {
    table.increments('id').primary()
    table.integer('unit_id').references('id').inTable('units').onDelete('CASCADE')
    table.integer('property_id').references('id').inTable('properties').onDelete('CASCADE')
    table.integer('tenant_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('landlord_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description').notNullable()
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium')
    table.enum('status', ['pending', 'in_progress', 'completed', 'cancelled']).defaultTo('pending')
    table.enum('category', ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest', 'other']).notNullable()
    table.text('landlord_response')
    table.timestamp('completed_at')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('maintenance_requests')
} 
exports.up = function (knex) {
  return knex.schema.createTable('units', (table) => {
    table.increments('id').primary()
    table.integer('property_id').references('id').inTable('properties').onDelete('CASCADE')
    table.string('unit_number').notNullable() // e.g., "Apt 1A", "Unit 2B"
    table.decimal('rent_amount', 10, 2).notNullable()
    table.enum('payment_frequency', ['weekly', 'monthly']).defaultTo('monthly')
    table.enum('status', ['available', 'occupied', 'maintenance']).defaultTo('available')
    table.integer('tenant_id').references('id').inTable('users').onDelete('SET NULL')
    table.date('lease_start')
    table.date('lease_end')
    table.text('amenities')
    table.text('description')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('units')
} 
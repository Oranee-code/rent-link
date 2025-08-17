exports.up = function (knex) {
  return knex.schema.createTable('properties', (table) => {
    table.increments('id').primary()
    table.integer('landlord_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('address').notNullable()
    table.string('city')
    table.string('state')
    table.string('zip_code')
    table.integer('total_units').defaultTo(1)
    table.decimal('total_rent_amount', 10, 2)
    table.enum('payment_frequency', ['weekly', 'monthly']).defaultTo('monthly')
    table.boolean('electric_included').defaultTo(false)
    table.boolean('water_included').defaultTo(false)
    table.boolean('internet_included').defaultTo(false)
    table.boolean('gas_included').defaultTo(false)
    table.text('amenities')
    table.text('description')
    table.enum('status', ['available', 'occupied', 'maintenance', 'unavailable']).defaultTo('available')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('properties')
} 
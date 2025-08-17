exports.up = function (knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id').primary()
    table.integer('unit_id').references('id').inTable('units').onDelete('CASCADE')
    table.integer('property_id').references('id').inTable('properties').onDelete('CASCADE')
    table.integer('tenant_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('landlord_id').references('id').inTable('users').onDelete('CASCADE')
    table.enum('type', ['rent', 'electric', 'water', 'internet', 'gas', 'other']).notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.date('due_date').notNullable()
    table.date('paid_date')
    table.enum('status', ['pending', 'paid', 'overdue', 'extended', 'verified']).defaultTo('pending')
    table.text('description')
    table.string('proof_of_payment') // URL to uploaded file
    table.boolean('landlord_verified').defaultTo(false)
    table.timestamp('verification_date')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('payments')
} 
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('auth0_id').unique().notNullable()
    table.string('email').notNullable()
    table.string('name').notNullable()
    table.enum('role', ['owner', 'tenant']).notNullable()
    table.string('phone')
    table.string('profile_photo')
    table.text('bio')
    table.string('address')
    table.string('city')
    table.string('state')
    table.string('zip_code')
    table.string('country').defaultTo('US')
    table.boolean('email_notifications').defaultTo(true)
    table.boolean('sms_notifications').defaultTo(false)
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
} 
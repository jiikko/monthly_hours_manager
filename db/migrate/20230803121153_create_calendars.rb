class CreateCalendars < ActiveRecord::Migration[7.0]
  def change
    create_table :calendars do |t|
      t.bigint :user_id, null: false, index: true
      t.string :name, null: false
      t.integer :base_hours, null: false, limit: 2
      t.integer :working_wday_bits, null: false, limit: 1

      t.timestamps
    end
  end
end

class CreateCalendars < ActiveRecord::Migration[7.0]
  def change
    create_table :calendars do |t|
      t.string :unique_key, null: false
      t.bigint :user_id, null: false, index: true
      t.string :name, null: false
      t.integer :base_hours, null: false, limit: 2
      t.integer :working_wday_bits, null: false, limit: 1

      t.index [:user_id, :unique_key], unique: true
      t.timestamps
    end
  end
end

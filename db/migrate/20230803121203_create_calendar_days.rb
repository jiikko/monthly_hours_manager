class CreateCalendarDays < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_days do |t|
      t.string :unique_key, null: false
      t.bigint :calendar_month_id, null: false, index: true
      t.integer :day, null: false
      t.decimal :scheduled, null: true, precision: 3, scale: 1
      t.decimal :result, null: true, precision: 3, scale: 1
      t.boolean :special_holiday, null: false, default: false

      t.index [:calendar_month_id, :unique_key], unique: true
      t.index [:calendar_month_id, :day], unique: true
      t.timestamps
    end
  end
end

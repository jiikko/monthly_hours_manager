class CreateCalendarDays < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_days do |t|
      t.bigint :calendar_month_id, null: false, index: true
      t.integer :day, null: false
      t.decimal :scheduled, null: true, precision: 3, scale: 1
      t.decimal :result, null: true, precision: 3, scale: 1

      t.index [:calendar_month_id, :day], unique: true
      t.timestamps
    end
  end
end

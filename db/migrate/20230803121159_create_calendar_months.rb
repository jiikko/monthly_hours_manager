class CreateCalendarMonths < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_months do |t|
      t.bigint :calendar_id, null: false, index: true
      t.integer :month, null: false
      t.integer :year, null: false
      t.integer :scheduled, null: true

      t.index [:calendar_id, :month, :year], unique: true
      t.timestamps
    end
  end
end

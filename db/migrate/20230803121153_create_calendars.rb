class CreateCalendars < ActiveRecord::Migration[7.0]
  def change
    create_table :calendars do |t|
      t.bigint :user_id, null: false, index: true

      t.timestamps
    end
  end
end

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_03_121234) do
  create_table "calendar_days", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "calendar_month_id", null: false
    t.integer "day", null: false
    t.decimal "scheduled", precision: 3, scale: 1
    t.decimal "result", precision: 3, scale: 1
    t.boolean "special_holiday", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_month_id", "day"], name: "index_calendar_days_on_calendar_month_id_and_day", unique: true
    t.index ["calendar_month_id"], name: "index_calendar_days_on_calendar_month_id"
  end

  create_table "calendar_months", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "calendar_id", null: false
    t.integer "month", limit: 1, null: false
    t.integer "year", limit: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_id", "month", "year"], name: "index_calendar_months_on_calendar_id_and_month_and_year", unique: true
    t.index ["calendar_id"], name: "index_calendar_months_on_calendar_id"
  end

  create_table "calendars", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.integer "base_hours", limit: 2, null: false
    t.integer "working_wday_bits", limit: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_calendars_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

# frozen_string_literal: true

class CalendarMonth < ApplicationRecord
  WDAY_TABLE = ["月", "火", "水", "木", "金", "土", "日"]
  PREV_WDAY_TABLE = { "月" => '日', "火" => '月', "水" => '火', "木" => '水', "金" => '木', "土" => '金', "日" => '土' }
  MAX_WEEK_SIZE = 6

  has_many :calendar_days, dependent: :destroy

  def weeks
    grouped_days = calendar_days.group_by(&:wday)

    WDAY_TABLE.inject(nil) { |previous, wday|
      current = grouped_days[wday][0]
      next if current.nil?

      next(current) if previous.nil?
      if previous.day < current.day
        next previous
      else
        pw = nil
        WDAY_TABLE.size.times do
          pw = PREV_WDAY_TABLE[pw || wday]
          grouped_days[pw].unshift(nil)
          if pw == '月'
            break
          end
        end
      end
    }


    Array.new(MAX_WEEK_SIZE) do |week_no|
      WDAY_TABLE.map { |wday| grouped_days[wday][week_no]&.day }
    end
  end
end

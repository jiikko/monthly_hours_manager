# frozen_string_literal: true

class CalendarDay < ApplicationRecord
  belongs_to :calendar_month

  def wday
    cm = calendar_month
    wday = Date.new(cm.year, cm.month, day).wday
    days_of_week_jp = ["日", "月", "火", "水", "木", "金", "土"]
    day_of_week_jp = days_of_week_jp[wday]
  end
end

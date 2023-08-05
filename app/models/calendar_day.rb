# frozen_string_literal: true

class CalendarDay < ApplicationRecord
  belongs_to :calendar_month

  before_save do
    if special_holiday.present?
      self.scheduled = 0
      self.result = 0
    end
  end

  def wday
    cm = calendar_month
    wday = Date.new(cm.year, cm.month, day).wday
    days_of_week_jp = %w[日 月 火 水 木 金 土]
    days_of_week_jp[wday]
  end
end

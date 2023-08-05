# frozen_string_literal: true

class CalendarDay < ApplicationRecord
  belongs_to :calendar_month

  before_save :clear_values_if_special_holiday

  # @return [Integer]
  def wday
    cm = calendar_month
    wday_as_start_monday = Date.new(cm.year, cm.month, day).wday_as_start_monday
    days_of_week_jp = %w[月 火 水 木 金 土 日]
    days_of_week_jp[wday_as_start_monday]
  end

  # @return [Boolean]
  def not_scheduled_working_day?
    calendar_month.calendar.working_wday_bits_as_no.exclude?(to_date.wday_as_start_monday)
  end

  # @return [Boolean]
  def worked?
    # NOTE: 0.0.present?はtrueになるので0.1以上で判定する
    (scheduled && scheduled >= 0.1) && (result && result >= 0.1)
  end

  private

  # @return [Date]
  def to_date
    Date.new(calendar_month.year, calendar_month.month, day)
  end

  # @return [void]
  def clear_values_if_special_holiday
    return unless special_holiday.present?

    self.scheduled = 0
    self.result = 0
  end
end

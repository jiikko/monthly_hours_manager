# frozen_string_literal: true

class CalendarDay < ApplicationRecord
  belongs_to :calendar_month

  before_save :clear_values_if_special_holiday

  # @return [String]
  def wday_ja
    CalendarMonth::WDAYS[wday_as_start_monday]
  end

  # @return [Integer]
  def wday_as_start_monday
    to_date.wday_as_start_monday
  end

  # @return [Boolean]
  def not_scheduled_working_day?
    calendar_month.calendar.working_wday_bits_as_no.exclude?(wday_as_start_monday)
  end

  # @return [Boolean]
  def holiday?
    HolidayJp.holiday?(to_date)
  end

  # @return [Boolean]
  def worked?
    # NOTE: 0.0.present?はtrueになるので0.1以上で判定する
    scheduled? && result?
  end

  # @return [Boolean]
  def scheduled?
    scheduled && scheduled >= 0.1
  end

  # @return [Boolean]
  def result?
    result && result >= 0.1
  end

  private

  # @return [Date]
  def to_date
    Date.new(calendar_month.year, calendar_month.month, day)
  end

  # @return [void]
  def clear_values_if_special_holiday
    return unless special_holiday.present?

    self.scheduled = nil
    self.result = nil
  end
end

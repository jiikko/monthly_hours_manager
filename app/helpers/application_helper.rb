# frozen_string_literal: true

module ApplicationHelper
  # @param [CalendarDay, NilClass] calendar_day
  def get_calendar_month_table_td_style(calendar_day)
    return nil if calendar_day.nil?

    if calendar_day.special_holiday?
      'background-color:gray'
    elsif calendar_day.not_scheduled_working_day?
      'background-color:silver'
    elsif calendar_day.worked?
      'background-color:lime'
    end
  end
end

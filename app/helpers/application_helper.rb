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

  # @return [Boolean]
  def can_render_hours_text_field?(calendar_day)
    !calendar_day.special_holiday?
  end

  # @return [Boolean]
  def can_render_special_holiday_checkbox?(calendar_day)
    !calendar_day.worked?
  end
end

# frozen_string_literal: true

class CalendarMonthsController < ApplicationController
  def create
    @calendar = find_calendar
    now = Time.zone.now
    calendar_month = @calendar.calendar_months.find_or_create_by!(year: now.year, month: now.month)
    calendar_month.create_days!
    redirect_to calendar_month_path(calendar_month)
  end

  def show
    @calendar_month = find_calendar_month
  end

  def recalculate
    @calendar_month = find_calendar_month
    @calendar_month.recalculate_in_future
    redirect_to calendar_month_path(@calendar_month), notice: '再計算しました'
  end

  private

  def find_calendar
    Calendar.find(params[:calendar_id] || params[:id])
  end

  # @return [CalendarMonth]
  def find_calendar_month
    find_calendar.calendar_months.find(params[:id])
  end
end

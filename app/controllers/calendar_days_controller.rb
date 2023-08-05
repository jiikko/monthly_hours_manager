class CalendarDaysController < ApplicationController
  def update
    # TODO: current_user.calendars.find(params[:calendar_id]) みたいにする
    calendar_day = CalendarDay.find(params[:id])
    calendar_day.update!(calendar_day_params)
    redirect_to calendar_calendar_month_path(calendar_day.calendar_month.calendar, calendar_day.calendar_month), notice: '日付を更新しました'
  end

  private

  def calendar_day_params
    params.require(:calendar_day).permit(:special_holiday, :scheduled, :result)
  end
end

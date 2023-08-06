# frozen_string_literal: true

class CalendarsController < ApplicationController
  def index
    @calendars = current_user.calendars
  end

  def new
    @calendar = build_calendar
  end

  def create
    @calendar = build_calendar
    if @calendar.save
      redirect_to calendar_path(@calendar), notice: 'カレンダーを作成しました'
    else
      render :new
    end
  end

  def edit
    @calendar = find_calendar
  end

  def update
    @calendar = find_calendar
    if @calendar.update(calendar_params)
      redirect_to calendar_path(@calendar), notice: 'カレンダーを更新しました'
    else
      render :edit
    end
  end

  def show
    @calendar = find_calendar
  end

  private

  def calendar_params
    params.fetch(:calendar, {}).permit(:user_id, :name, :base_hours, working_wday_bits: [])
  end

  # @return [Calendar]
  def build_calendar
    calendar = Calendar.new(calendar_params)
    calendar.user_id = 0 # TODO: あとで修正する
    calendar
  end

  # @return [Calendar]
  def find_calendar
    # TODO: current_user.calendars.find(params[:id]) みたいにする
    Calendar.find(params[:id])
  end
end

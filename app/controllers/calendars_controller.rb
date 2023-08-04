# frozen_string_literal: true

class CalendarsController < ApplicationController
  def index
    # TODO: current_user.calendars みたいにする
    @calendars = Calendar.all
  end

  def new
    @calendar = Calendar.new
  end

  def create
    @calendar = Calendar.new(calendar_params)
    @calendar.user_id = 0 # TODO: あとで修正する
    if @calendar.save
      redirect_to calendar_path(@calendar), notice: 'カレンダーを作成しました'
    else
      render :new
    end
  end

  def show
    # TODO: current_user.calendars.find(params[:id]) みたいにする
    @calendar = Calendar.find(params[:id])
  end

  private

  def calendar_params
    params.require(:calendar).permit(:user_id, :name, :base_hours)
  end
end

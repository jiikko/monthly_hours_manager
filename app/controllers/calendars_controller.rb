# frozen_string_literal: true

class CalendarsController < ApplicationController
  def index
    # TODO: current_user.calendars みたいにする
    @calendars = Calendar.all
  end

  def show
    # TODO: current_user.calendars.find(params[:id]) みたいにする
    @calendar = Calendar.find(params[:id])
  end
end

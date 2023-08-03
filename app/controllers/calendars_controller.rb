# frozen_string_literal: true

class CalendarsController < ApplicationController
  def index; end

  def show
    # TODO: current_user.calendars.find(params[:id]) みたいにする
    @calendar = Calendar.find(params[:id])
  end
end

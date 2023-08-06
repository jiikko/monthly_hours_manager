# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # TODO: あとで修正する
  def current_user
    OpenStruct.new(calendars: Calendar.all)
  end
end

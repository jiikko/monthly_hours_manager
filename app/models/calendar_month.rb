# frozen_string_literal: true

class CalendarMonth < ApplicationRecord
  has_many :calendar_days, dependent: :destroy

  def weeks
    calendar_days.each_slice(7).to_a
  end
end

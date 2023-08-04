# frozen_string_literal: true

class CalendarMonth < ApplicationRecord
  WDAY_TABLE = %w[月 火 水 木 金 土 日].freeze
  PREV_WDAY_TABLE = { '月' => '日', '火' => '月', '水' => '火', '木' => '水', '金' => '木', '土' => '金', '日' => '土' }.freeze
  MAX_WEEK_SIZE = 6

  belongs_to :calendar

  has_many :days, dependent: :destroy, class_name: 'CalendarDay'

  # @return [void]
  def create_days!
    Date.new(year, month, 1).end_of_month.day.times do |day|
      days.create!(day: day + 1)
    end
  end

  def weeks
    grouped_days = days.group_by(&:wday)

    WDAY_TABLE.inject(nil) do |previous, wday|
      current = grouped_days[wday][0]

      next(current) if previous.nil?
      next previous if previous.day < current.day

      pw = nil
      WDAY_TABLE.size.times do
        pw = PREV_WDAY_TABLE[pw || wday]
        grouped_days[pw].unshift(nil)
        break if pw == '月'
      end
    end

    Array.new(MAX_WEEK_SIZE) do |week_no|
      WDAY_TABLE.map { |wday| grouped_days[wday][week_no]&.day }
    end
  end
end

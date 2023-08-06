# frozen_string_literal: true

class CalendarMonth < ApplicationRecord
  WDAYS = %w[月 火 水 木 金 土 日].freeze
  PREV_WDAYS = { '月' => '日', '火' => '月', '水' => '火', '木' => '水', '金' => '木', '土' => '金', '日' => '土' }.freeze
  MAX_WEEK_SIZE = 6

  belongs_to :calendar

  has_many :days, dependent: :destroy, class_name: 'CalendarDay'

  def self.exists_current_month?
    today = Date.today
    exists?(year: today.year, month: today.month)
  end

  # @return [void]
  def create_days!
    current_day = Date.new(year, month, 1)
    scheduled_working_days_length = current_day.all_month.select { |d| calendar.working_wday_bits_as_no.include?(d.wday_as_start_monday) }.size
    # TODO: stepを指定できるようにしたい
    scheduled_working_hours_per_day = (calendar.base_hours / scheduled_working_days_length.to_f).floor(1)

    Date.new(year, month, 1).all_month.each do |date|
      if calendar.working_wday_bits_as_no.include?(date.wday_as_start_monday)
        days.create!(day: date.day, scheduled: scheduled_working_hours_per_day)
      else
        days.create!(day: date.day, scheduled: 0)
      end
    end
  end

  # @return [Array<Array<CalendarDay>>]
  def weeks
    grouped_days = days.group_by(&:wday_ja)

    WDAYS.inject(nil) do |previous, wday|
      current = grouped_days[wday][0]

      next(current) if previous.nil?
      next previous if previous.day < current.day

      pw = nil
      WDAYS.size.times do
        pw = PREV_WDAYS[pw || wday]
        grouped_days[pw].unshift(nil)
        break if pw == '月'
      end
    end

    Array.new(MAX_WEEK_SIZE) do |week_no|
      WDAYS.map { |wday| grouped_days[wday][week_no] }
    end
  end

  # @return [Integer]
  def scheduled_sum
    days.select(&:scheduled).sum(&:scheduled)
  end

  # @return [Integer]
  def result_sum
    days.select(&:result).sum(&:result)
  end

  # @return [void]
  def recalculate_in_future
    scheduled_sum_with_done = days.select(&:result).sum(&:scheduled)
    filled_days_size = days.select(&:result).size
    special_holiday_size = days.select(&:special_holiday).size

    current_day = Date.new(year, month, 1)
    scheduled_working_days_length = current_day.all_month.select { |d| calendar.working_wday_bits_as_no.include?(d.wday_as_start_monday) }.size
    working_available_working_days_in_future = scheduled_working_days_length - filled_days_size - special_holiday_size
    scheduled_working_hours_per_day = ((calendar.base_hours - scheduled_sum_with_done) / working_available_working_days_in_future.to_f).floor(1)

    days.each do |calendar_day|
      next if calendar_day.special_holiday? || (calendar_day.result && calendar_day.result >= 0.1)

      calendar_day.update!(scheduled: scheduled_working_hours_per_day) if calendar.working_wday_bits_as_no.include?(calendar_day.wday_as_start_monday)
    end
  end
end

# frozen_string_literal: true

class WorkingWdayBitsGenerator
  # @param [Array<String>] working_wdays_as_ja
  def initialize(working_wdays_as_ja)
    @working_wdays = working_wdays_as_ja
  end

  # @return [Array<Integer>]
  def execute
    bit_array = CalendarMonth::WDAYS.map do |wday|
      @working_wdays.include?(wday) ? 1 : 0
    end
    [bit_array.reverse.join.to_i(2)]
  end
end

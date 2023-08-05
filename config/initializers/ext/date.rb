# frozen_string_literal: true

class Date
  # @return [Integer] 月曜始まりの曜日を返す
  def wday_as_start_monday
    wday.zero? ? 6 : wday - 1
  end
end

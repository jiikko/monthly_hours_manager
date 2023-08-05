# frozen_string_literal: true

class Calendar < ApplicationRecord
  has_many :calendar_months, dependent: :destroy

  validates :name, :base_hours, presence: true
  validates :base_hours, numericality: { greater_than_or_equal_to: 1 }
  validates :working_wday_bits, inclusion: { in: 0..127 }

  # @param [Array<String>]
  # @return [void]
  def working_wday_bits=(value)
    super(value.map(&:to_i).sum)
  end
end

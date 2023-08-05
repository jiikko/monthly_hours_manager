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

  # @return [Array<String>]
  def working_wday_bits_as_ja
    working_wday_bits.to_s(2).reverse.chars.map.with_index do |bit, index|
      CalendarMonth::WDAYS[index] if bit == '1'
    end.compact
  end

  # @return [Array<Integer>]
  def working_wday_bits_as_no
    working_wday_bits.to_s(2).reverse.chars.map.with_index do |bit, index|
      index if bit == '1'
    end.compact
  end
end

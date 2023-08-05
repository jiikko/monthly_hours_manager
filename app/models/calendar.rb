# frozen_string_literal: true

class Calendar < ApplicationRecord
  has_many :calendar_months, dependent: :destroy

  validates :name, :base_hours, presence: true
end

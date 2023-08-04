# frozen_string_literal: true

FactoryBot.define do
  factory :calendar_month do
    trait :with_days do
      after(:create, &:create_days!)
    end
  end
end

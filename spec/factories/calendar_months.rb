FactoryBot.define do
  factory :calendar_month do
    trait :with_days do
      after(:create) do |calendar_month|
        calendar_month.create_days!
      end
    end
  end
end

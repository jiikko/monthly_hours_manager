# frozen_string_literal: true

FactoryBot.define do
  factory :calendar do
    name { 'name' }
    user_id { 0 } # TODO: あとで修正する
  end
end

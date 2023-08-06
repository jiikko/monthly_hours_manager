# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CalendarDay, type: :model do
  describe '#wday_ja' do
    subject { calendar_day.wday_ja }

    let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[月 火 水 木 金 土 日]).execute) }

    context '2023-8-1' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 8, calendar: calender) }
      let(:calendar_day) { calendar_month.days.find_by(day: 1) }

      it { is_expected.to eq('火') }
    end
  end

  describe '#wday_as_start_monday' do
    subject { calendar_day.wday_as_start_monday }

    let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[月 火 水 木 金 土 日]).execute) }

    context '2023-8-1' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 8, calendar: calender) }
      let(:calendar_day) { calendar_month.days.find_by(day: 1) }

      it { is_expected.to eq(1) }
    end
  end
end

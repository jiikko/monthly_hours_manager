# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CalendarMonth, type: :model do
  describe '#create_days!' do
    context '稼働基準が84時間で, 稼働曜日が全日の時' do
      let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[月 火 水 木 金 土 日]).execute) }

      context 'year is 2023, month is 7' do
        let(:calendar_month) { FactoryBot.create(:calendar_month, year: 2023, month: 7, calendar: calender) }

        subject { calendar_month.create_days! }

        it 'create 31 days' do
          expect { subject }.to change { calendar_month.days.count }.from(0).to(31)
        end

        it 'create 31 days with day 1 to 28' do
          subject
          expect(calendar_month.days.map(&:day)).to eq((1..31).to_a)
        end

        it '稼働曜日の曜日のscheduled_hoursが設定される' do
          subject
          expect(calendar_month.days.sum(&:scheduled)).to eq(83.7)
          expect(calendar_month.days.pluck(:scheduled).map(&:to_f)).to eq(Array.new(31, 2.7))
        end
      end
    end

    context '稼働基準が84時間で, 稼働曜日が日の時' do
      let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[日]).execute) }

      context 'year is 2023, month is 7' do
        let(:calendar_month) { FactoryBot.create(:calendar_month, year: 2023, month: 7, calendar: calender) }

        subject { calendar_month.create_days! }

        it 'create 31 days' do
          expect { subject }.to change { calendar_month.days.count }.from(0).to(31)
        end

        it 'create 31 days with day 1 to 28' do
          subject
          expect(calendar_month.days.map(&:day)).to eq((1..31).to_a)
        end

        it '稼働曜日の曜日のscheduled_hoursが設定される' do
          subject
          expect(calendar_month.days.sum(&:scheduled).floor(1).to_f).to eq(84)
          expect(calendar_month.days.pluck(:scheduled).map(&:to_f)).to eq(
            [0.0, 16.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.8, 0.0]
          )
        end
      end
    end

    context '稼働基準が84時間で, 稼働曜日が月、火、水の時' do
      let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[月 火 水]).execute) }

      context 'year is 2023, month is 7' do
        let(:calendar_month) { FactoryBot.create(:calendar_month, year: 2023, month: 7, calendar: calender) }

        subject { calendar_month.create_days! }

        it 'create 31 days' do
          expect { subject }.to change { calendar_month.days.count }.from(0).to(31)
        end

        it 'create 31 days with day 1 to 28' do
          subject
          expect(calendar_month.days.map(&:day)).to eq((1..31).to_a)
        end

        it '稼働曜日の曜日のscheduled_hoursが設定される' do
          subject
          expect(calendar_month.days.pluck(:scheduled).map(&:to_f)).to eq(
            [0.0, 0.0, 6.4, 6.4, 6.4, 0.0, 0.0, 0.0, 0.0, 6.4, 6.4, 6.4, 0.0, 0.0, 0.0, 0.0, 6.4, 6.4, 6.4, 0.0, 0.0, 0.0, 0.0, 6.4, 6.4, 6.4, 0.0, 0.0, 0.0, 0.0, 6.4]
          )
        end
      end

      context 'year is 2023, month is 2' do
        let(:calendar_month) { FactoryBot.create(:calendar_month, year: 2023, month: 2, calendar: calender) }

        subject { calendar_month.create_days! }

        it 'create 28 days' do
          expect { subject }.to change { calendar_month.days.count }.from(0).to(28)
        end

        it 'create 28 days with day 1 to 28' do
          subject
          expect(calendar_month.days.map(&:day)).to eq((1..28).to_a)
        end

        it '稼働曜日の曜日のscheduled_hoursが設定される' do
          subject
          expect(calendar_month.days.sum(&:scheduled)).to eq(84)
          expect(calendar_month.days.pluck(:scheduled).map(&:to_f)).to eq(
            [7.0, 0.0, 0.0, 0.0, 0.0, 7.0, 7.0, 7.0, 0.0, 0.0, 0.0, 0.0, 7.0, 7.0, 7.0, 0.0, 0.0, 0.0, 0.0, 7.0, 7.0, 7.0, 0.0, 0.0, 0.0, 0.0, 7.0, 7.0]
          )
        end
      end
    end
  end

  describe '#weeks' do
    let(:calender) { FactoryBot.create(:calendar, base_hours: 8, working_wday_bits: [1]) }

    subject { calendar_month.weeks }

    context 'year is 2023, month is 7' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 7, calendar: calender) }

      it 'return 6 weeks' do
        expect(subject.map { |x| x.map { |y| y&.day } }).to eq([[nil, nil, nil, nil, nil, 1, 2],
                                                                [3, 4, 5, 6, 7, 8, 9],
                                                                [10, 11, 12, 13, 14, 15, 16],
                                                                [17, 18, 19, 20, 21, 22, 23],
                                                                [24, 25, 26, 27, 28, 29, 30],
                                                                [31, nil, nil, nil, nil, nil, nil]])
      end
    end

    context 'year is 2023, month is 2' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 2, calendar: calender) }

      it 'return 5 weeks' do
        expect(subject.map { |x| x.map { |y| y&.day } }).to eq([[nil, nil, 1, 2, 3, 4, 5],
                                                                [6, 7, 8, 9, 10, 11, 12],
                                                                [13, 14, 15, 16, 17, 18, 19],
                                                                [20, 21, 22, 23, 24, 25, 26],
                                                                [27, 28, nil, nil, nil, nil, nil],
                                                                [nil, nil, nil, nil, nil, nil, nil]])
      end
    end
  end
end

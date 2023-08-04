require 'rails_helper'

RSpec.describe CalendarMonth, type: :model do
  describe '#create_days!' do
    let(:calender) { FactoryBot.create(:calendar) }

    context 'year is 2023, month is 7' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, year: 2023, month: 7, calendar: calender) }

      subject { calendar_month.create_days! }

      it 'create 31 days' do
        expect { subject }.to change{ calendar_month.days.count }.from(0).to(31)
      end

      it 'create 31 days with day 1 to 28' do
        subject
        expect(calendar_month.days.map(&:day)).to eq((1..31).to_a)
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
    end
  end

  describe '#weeks' do
    let(:calender) { FactoryBot.create(:calendar) }

    subject { calendar_month.weeks }

    context 'year is 2023, month is 7' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 7, calendar: calender) }

      it 'return 6 weeks' do
        expect(subject).to eq([
          [nil, nil, nil, nil, nil, 1, 2],
          [3, 4, 5, 6, 7, 8, 9],
          [10, 11, 12, 13, 14, 15, 16],
          [17, 18, 19, 20, 21, 22, 23],
          [24, 25, 26, 27, 28, 29, 30],
          [31, nil, nil, nil, nil, nil, nil],
        ])
      end
    end

    context 'year is 2023, month is 2' do
      let(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 2, calendar: calender) }

      it 'return 5 weeks' do
        expect(subject).to eq([
          [nil, nil, 1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10, 11, 12],
          [13, 14, 15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24, 25, 26],
          [27, 28, nil, nil, nil, nil, nil],
          [nil, nil, nil, nil, nil, nil, nil],
        ])
      end
    end
  end
end

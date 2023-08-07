# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Calendars', type: :system do
  before do
    driven_by(:rack_test)
  end

  it 'カレンダーと月を作成すること' do
    visit root_path
    find("a[data-test='new_calendar']").click

    # カレンダー作成画面
    find("input[data-test='name']").set('テストカレンダー')
    find("input[data-test='base_hours']").set(84)
    check '月'
    check '火'
    check '水'
    find("input[data-test-id='submit']").click

    # カレンダー詳細画面
    expect(page).to have_content 'カレンダーを作成しました'
    find("a[data-test='create_calendar_months']").click

    # 月の詳細画面
    expect(page).to have_content '基準時間: 84時間'
  end

  describe 'カレンダーがすでにあるとき' do
    let(:calender) { FactoryBot.create(:calendar, base_hours: 84, working_wday_bits: WorkingWdayBitsGenerator.new(%w[月 火 水 木 金 土 日]).execute) }
    let!(:calendar_month) { FactoryBot.create(:calendar_month, :with_days, year: 2023, month: 8, calendar: calender) }

    it 'カレンダーを編集ができること' do
      visit root_path
      find("a[data-test-id='#{calender.unique_key}']").click
      click_on '編集'

      # 編集画面
      find("input[data-test-id='submit']").click
      expect(page).to have_content 'カレンダーを更新しました'
    end
  end
end

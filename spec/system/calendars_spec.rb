# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Calendars', type: :system do
  before do
    driven_by(:rack_test)
  end

  it 'カレンダーと月を作成する' do
    visit root_path
    find("a[data-test='new_calendar']").click

    # カレンダー作成画面
    find("input[data-test='name']").set('テストカレンダー')
    find("input[data-test='base_hours']").set(84)
    check '月'
    check '火'
    check '水'
    find("input[data-test='submit']").click

    # カレンダー詳細画面
    expect(page).to have_content 'カレンダーを作成しました'
    find("a[data-test='create_calendar_months']").click

    # 月の詳細画面
    expect(page).to have_content '基準時間: 84時間'
  end
end

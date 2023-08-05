calendar = Calendar.find_or_create_by!(name: '取引先A') do |c|
  c.user_id = 0 # TODO: あとで修正する
  c.base_hours = 84
  c.working_wday_bits = WorkingWdayBitsGenerator.new(%w[月 火 水]).execute
end

if calendar.calendar_months.exists_current_month?
  puts 'already created calendar_month and days!'
else
  now = Time.zone.now
  calendar_month = calendar.calendar_months.find_or_create_by!(year: now.year, month: now.month, )
  calendar_month.create_days!
  puts 'created calendar_month and days!'
end

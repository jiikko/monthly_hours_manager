import {CalendarMonthView} from 'lib/calendar_month_view'

describe('CalendarMonthView', () => {
  describe('headerWeeks', () => {
    it('returns header weeks', () => {
      const calendarMonthView = new CalendarMonthView(2021, 1)
      expect(calendarMonthView.headerWeeks()).toEqual(['日', '月', '火', '水', '木', '金', '土'])
    })
  })
})

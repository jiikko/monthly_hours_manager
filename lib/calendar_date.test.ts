import { CalendarDate } from './calendar_date';

describe('CalendarDate', () => {
  describe('引数に2023,08を与えるとき', () => {
    it('new Date(2023, 7, 1)を作る', () => {
      const calendarDate = CalendarDate(2023, 8, 1);
      expect(calendarDate.year()).toBe(2023);
      expect(calendarDate.month()).toBe(8);
      expect(calendarDate.day()).toBe(1);
      expect(calendarDate.nextMonth()).toBe(9);
      expect(calendarDate.lastDayOfMonth()).toBe(31);
      expect(calendarDate.firstWeekDayOfMonth()).toBe(2);
      expect(calendarDate.monthlyKey()).toBe('2023-8');
    })
  })

  describe('引数に2023,9を与えるとき', () => {
    it('new Date(2023, 8, 1)を作る', () => {
      const calendarDate = CalendarDate(2023, 9, 1);
      expect(calendarDate.year()).toBe(2023);
      expect(calendarDate.month()).toBe(9);
      expect(calendarDate.day()).toBe(1);
      expect(calendarDate.nextMonth()).toBe(10);
      expect(calendarDate.lastDayOfMonth()).toBe(30);
      expect(calendarDate.firstWeekDayOfMonth()).toBe(5);
      expect(calendarDate.monthlyKey()).toBe('2023-9');
    })
  })

  describe('引数に2023,11を与えるとき', () => {
    it('new Date(2023, 10, 1)を作る', () => {
      const calendarDate = CalendarDate(2023, 11, 1);
      expect(calendarDate.year()).toBe(2023);
      expect(calendarDate.month()).toBe(11);
      expect(calendarDate.day()).toBe(1);
      expect(calendarDate.nextMonth()).toBe(12);
      expect(calendarDate.lastDayOfMonth()).toBe(30);
      expect(calendarDate.firstWeekDayOfMonth()).toBe(3);
      expect(calendarDate.monthlyKey()).toBe('2023-11');
    })
  })


  describe('引数に2023,12を与えるとき', () => {
    it('new Date(2023, 11, 1)を作る', () => {
      const calendarDate = CalendarDate(2023, 12, 1);
      expect(calendarDate.year()).toBe(2023);
      expect(calendarDate.month()).toBe(12);
      expect(calendarDate.day()).toBe(1);
      expect(calendarDate.nextMonth()).toBe(1);
      expect(calendarDate.lastDayOfMonth()).toBe(31);
      expect(calendarDate.firstWeekDayOfMonth()).toBe(5);
      expect(calendarDate.monthlyKey()).toBe('2023-12');
    })
  })

  describe('引数に2023,1を与えるとき', () => {
    it('new Date(2023, 0, 1)を作る', () => {
      const calendarDate = CalendarDate(2023, 1, 1);
      expect(calendarDate.year()).toBe(2023);
      expect(calendarDate.month()).toBe(1);
      expect(calendarDate.day()).toBe(1);
      expect(calendarDate.nextMonth()).toBe(2);
      expect(calendarDate.lastDayOfMonth()).toBe(31);
      expect(calendarDate.firstWeekDayOfMonth()).toBe(0);
      expect(calendarDate.monthlyKey()).toBe('2023-1');
    })
  })

  describe('引数を与えないとき', () => {
  })
})

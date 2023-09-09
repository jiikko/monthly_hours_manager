import { DaysGenerator, DayObject } from './days_generator';

describe('DaysGenerator', () => {
  describe('execute', () => {
    describe('2023年8月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const actual = DaysGenerator.execute(2023, 8, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false });
        expect(actual[0]).toEqual({ day: 1, scheduled: 6.0, actual: 0.0, isHoliday: false });
        expect(actual[30]).toEqual({ day: 31, scheduled: 0.0, actual: 0.0, isHoliday: false });
      })
    })

    describe('2023年9月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const actual = DaysGenerator.execute(2023, 9, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false });
        expect(actual[0]).toEqual({ day: 1, scheduled: 0, actual: 0.0, isHoliday: false });
        expect(actual[17]).toEqual({ day: 18, scheduled: 7.6, actual: 0.0, isHoliday: true }); // 祝日なので稼働日ではない
        expect(actual[29]).toEqual({ day: 30, scheduled: 0, actual: 0.0, isHoliday: false });
      })
    })
  })

  describe('executeWithDays', () => {
    describe('2023年8月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const days = [
          { "scheduled": 0, "actual": 0,   "day": 1,  isHoliday: false },
          { "scheduled": 10, "actual": 10, "day": 2, isHoliday: false },
          { "scheduled": 10, "actual": 10, "day": 3, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 4, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 5, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 6, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 7, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 8, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 9, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 10, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 11, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 12, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 13, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 14, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 15, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 16, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 17, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 18, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 19, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 20, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 21, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 22, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 23, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 24, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 25, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 26, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 27, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 28, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 29, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 30, isHoliday: false },
          { "scheduled": 0, "actual": 0,   "day": 31, isHoliday: false }
        ]
        const d = days.map((dd) => { return new DayObject(dd.scheduled, dd.actual, dd.day, dd.isHoliday) });
        const actual = DaysGenerator.executeWithDays(2023, 8, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false }, d);
        expect(actual[0]).toEqual({ day: 1, scheduled: 5.3, actual: 0.0, isHoliday: false });
        expect(actual[30]).toEqual({ day: 31, scheduled: 0.0, actual: 0.0, isHoliday: false });
      })
    })
  })
})

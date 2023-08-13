import DaysGenerator from './days_generator';

describe('DaysGenerator', () => {
  describe('execute', () => {
    describe('2023年8月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const actual = DaysGenerator.execute(2023, 8, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false });
        expect(actual[0]).toEqual({ day: 1, scheduled: 6.0, actual: 0.0 });
        expect(actual[30]).toEqual({ day: 31, scheduled: 0.0, actual: 0.0 });
      })
    })
  })

  describe('executeWithDays', () => {
    describe('2023年8月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const days = [
          { "scheduled": 0, "actual": 0, "day": 1 },
          { "scheduled": 10, "actual": 10, "day": 2 },
          { "scheduled": 10, "actual": 10, "day": 3 },
          { "scheduled": 0, "actual": 0, "day": 4 },
          { "scheduled": 0, "actual": 0, "day": 5 },
          { "scheduled": 0, "actual": 0, "day": 6 },
          { "scheduled": 0, "actual": 0, "day": 7 },
          { "scheduled": 0, "actual": 0, "day": 8 },
          { "scheduled": 0, "actual": 0, "day": 9 },
          { "scheduled": 0, "actual": 0, "day": 10 },
          { "scheduled": 0, "actual": 0, "day": 11 },
          { "scheduled": 0, "actual": 0, "day": 12 },
          { "scheduled": 0, "actual": 0, "day": 13 },
          { "scheduled": 0, "actual": 0, "day": 14 },
          { "scheduled": 0, "actual": 0, "day": 15 },
          { "scheduled": 0, "actual": 0, "day": 16 },
          { "scheduled": 0, "actual": 0, "day": 17 },
          { "scheduled": 0, "actual": 0, "day": 18 },
          { "scheduled": 0, "actual": 0, "day": 19 },
          { "scheduled": 0, "actual": 0, "day": 20 },
          { "scheduled": 0, "actual": 0, "day": 21 },
          { "scheduled": 0, "actual": 0, "day": 22 },
          { "scheduled": 0, "actual": 0, "day": 23 },
          { "scheduled": 0, "actual": 0, "day": 24 },
          { "scheduled": 0, "actual": 0, "day": 25 },
          { "scheduled": 0, "actual": 0, "day": 26 },
          { "scheduled": 0, "actual": 0, "day": 27 },
          { "scheduled": 0, "actual": 0, "day": 28 },
          { "scheduled": 0, "actual": 0, "day": 29 },
          { "scheduled": 0, "actual": 0, "day": 30 },
          { "scheduled": 0, "actual": 0, "day": 31 }
        ]
        const actual = DaysGenerator.executeWithDays(2023, 8, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false }, days);
        expect(actual[0]).toEqual({ day: 1, scheduled: 5.3, actual: 0.0 });
        expect(actual[30]).toEqual({ day: 31, scheduled: 0.0, actual: 0.0 });
      })
    })
  })
})

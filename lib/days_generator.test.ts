import DaysGenerator from './days_generator';

describe('DaysGenerator', () => {
  describe('execute', () => {
    describe('2023年8月の月火水が稼働日のとき', () => {
      it('配列を返す', () => {
        const actual = DaysGenerator.execute(2023, 8, 84, { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false });
        expect(actual[0]).toEqual({ day: 1, scheduled: 6, actual: 0 });
        expect(actual[30]).toEqual({ day: 31, scheduled: 0, actual: 0 });
      })
    })
  })
})

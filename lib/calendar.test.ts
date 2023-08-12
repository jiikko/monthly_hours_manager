import { allDaysInMonth } from './calendar';

describe('allDaysInMonth', () => {
  describe('2023年8月の場合', () => {
    it('31日分のDateオブジェクトを返す', () => {
      const date = new Date(2023, 7, 1);
      const days = allDaysInMonth(date);

      expect(days.length).toBe(31);
      expect(days[0].getDate()).toBe(1);
      expect(days[30].getDate()).toBe(31);
      expect(days[0].getMonth()).toBe(7);
      expect(days[0].getDay()).toBe(2); // 火曜日: 2
      expect(days[0].getDate()).toBe(1);
    })
  })
})

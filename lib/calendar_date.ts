const JapaneseHolidays = require('japanese-holidays');

type CalendarDateType = {
  day: () => number;
  month: () => number;
  nextMonth: () => number;
  year: () => number;
  monthlyKey: () => string;
  weekDay: () => number;
  firstWeekDayOfMonth: () => number;
  lastDayOfMonth: () => number;
  weekDayName: () => string;
  isNationalHoliday: () => boolean;
  previousMonthDate: () => CalendarDateType;
  nextDateOnMonth: () => CalendarDateType;
  nextMonthDate: () => CalendarDateType;
}

// new Dateから月を取得すると0~11で取得されるため、処理しやすい値で返すDateクラスのラッパー
const CalendarDate = (()  => {
  return function (argYear?: number, getMonth?: number, getDay?: number): CalendarDateType {
    let date: Date;

    if (argYear && getMonth && getDay) {
      date = new Date(argYear, getMonth - 1, getDay);
    } else {
      date = new Date();
    }

    function year() {
      return date.getFullYear();
    }

    function month() {
      return date.getMonth() + 1; // NOTE: 0~11で取得されるため、1~12で返す
    }

    function nextMonth() {
      if (month() === 12) { // 12月の次は1月
        return 1;
      } else {
        return month() + 1;
      }
    }

    function day() {
      return date.getDate();
    }

    function monthlyKey() {
      return `${year()}-${month()}`;
    }

    // NOTE: 0:日曜日, 1:月曜日, 2:火曜日, 3:水曜日, 4:木曜日, 5:金曜日, 6:土曜日
    function weekDay() {
      return date.getDay();
    }

    function weekDayName(): string {
      const weekDayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return weekDayNames[weekDay()];
    }

    // NOTE: 月の最初の日の曜日を取得する
    function firstWeekDayOfMonth(): number {
      return new Date(year(), month() - 1, 1).getDay();
    }

    //  当月の最終日の日付を取得
    function lastDayOfMonth(): number {
      return new Date(year(), month(), 0).getDate();
    }

    function isNationalHoliday() {
      return !!JapaneseHolidays.isHoliday(date);
    }

    function previousMonthDate() {
      let previousYear = year();
      let previousMonth = month();
      if (previousMonth === 1) {
        previousYear -= 1;
        previousMonth = 12;
      } else {
        previousMonth -= 1;
      }
      return CalendarDate(previousYear, previousMonth, 1);
    }

    function nextMonthDate() {
      let nextYear = year();
      let nextMonth = month();
      if (nextMonth === 12) {
        nextYear += 1;
        nextMonth = 1;
      } else {
        nextMonth += 1;
      }
      return CalendarDate(nextYear, nextMonth, 1);
    }

    function nextDateOnMonth() {
      let nextYear = year();
      let nextMonth = month();
      if (nextMonth === 12) {
        nextYear += 1;
        nextMonth = 1;
      } else {
        nextMonth += 1;
      }
      return CalendarDate(nextYear, nextMonth, 1);
    }

    return { day,
      firstWeekDayOfMonth,
      isNationalHoliday,
      lastDayOfMonth,
      month,
      monthlyKey,
      previousMonthDate,
      nextDateOnMonth, // @deprecated
      nextMonthDate,
      nextMonth,
      weekDay,
      weekDayName,
      year,
    };
  };
})();

export { CalendarDate };
export type { CalendarDateType };

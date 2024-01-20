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
  previousMonth: () => number;
  previousYear: () => number;
  nextYear: () => number;
  nextMonthDate: () => CalendarDateType;
  isToday: () => boolean;
  compareYearMonth: (other: CalendarDateType) => boolean;
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

    function previousMonth() {
      if (month() === 1) {
        return 12;
      } else {
        return month() - 1;
      }
    }

    function nextMonth() {
      if (month() === 12) {
        return 1;
      } else {
        return month() + 1;
      }
    }

    function previousYear() {
      if (month() === 1) {
        return year() - 1;
      } else {
        return year();
      }
    }

    function nextYear() {
      if (month() === 12) {
        return year() + 1;
      } else {
        return year();
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

    function isToday() {
      const today = new Date();
      return today.getFullYear() === year() && today.getMonth() + 1 === month() && today.getDate() === day();
    }

    // 年月が同じかを比較すると0
    function compareYearMonth(other: CalendarDateType) {
      return(year() === other.year() && month() === other.month());
    }

    return { day,
      firstWeekDayOfMonth,
      isNationalHoliday,
      lastDayOfMonth,
      month,
      monthlyKey,
      previousMonth,
      previousYear,
      nextYear,
      nextMonthDate,
      nextMonth,
      weekDay,
      weekDayName,
      year,
      isToday,
      compareYearMonth,
    };
  };
})();

function Today(): CalendarDateType {
  return CalendarDate();
}

export { CalendarDate, Today };
export type { CalendarDateType };

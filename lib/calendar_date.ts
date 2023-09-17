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
  nextDateOnMonth: () => CalendarDateType;
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
    function firstWeekDayOfMonth() {
      return new Date(year(), month() - 1, 1).getDay();
    }

    //  当月の最終日の日付を取得
    function lastDayOfMonth() {
      return new Date(year(), month(), 0).getDate();
    }

    function isNationalHoliday() {
      return !!JapaneseHolidays.isHoliday(date);
    }

    function nextDateOnMonth() {
      const nextDate = new Date(year(), month(), 1);
      return CalendarDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate());
    }

    return { day,
      firstWeekDayOfMonth,
      isNationalHoliday,
      lastDayOfMonth,
      month,
      monthlyKey,
      nextDateOnMonth,
      nextMonth,
      weekDay,
      weekDayName,
      year,
    };
  };
})();

export { CalendarDate };
export type { CalendarDateType };

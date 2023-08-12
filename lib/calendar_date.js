// new Dateから月を取得すると0~11で取得されるため、処理しやすい値で返すDateクラスのラッパー
const CalendarDate = (() => {
  return function (argYear, getMonth, getDay) {
    let date;

    if (argYear && getMonth && getDay) {
      date = new Date(argYear, getMonth, getDay);
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
      return date.getMonth() + 2;
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

    // NOTE: 月の最初の日の曜日を取得する
    function firstWeekDayOfMonth() {
      return new Date(year(), month() - 1, 1).getDay();
    }

    //  当月の最終日の日付を取得
    function lastDayOfMonth() {
      return new Date(year(), month() -1, 0).getDate();
      }

    return { day, month, nextMonth, year, monthlyKey, weekDay, firstWeekDayOfMonth, lastDayOfMonth };
  };
})();

export { CalendarDate };

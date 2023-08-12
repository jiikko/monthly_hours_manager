// new Dateから月を取得すると0~11で取得されるため、処理しやすい値で返すDateクラスのラッパー
const CalendarDate = (() => {
  return function (argYear, getMonth, getDay) {
    let date;

    if (argYear && getMonth && getDay) {
      date = new Date(argYear, getMonth + 1, getDay);
    } else {
      date = new Date();
    }

    function year() {
      return date.getFullYear();
    }

    function month() {
      return date.getMonth() + 1;
    }

    function nextMonth() {
      return date.getMonth() + 2;
    }

    function day() {
      return date.getDate();
    }

    return { day, month, nextMonth, year };
  };
})();

export { CalendarDate };

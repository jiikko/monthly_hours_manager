import { Week } from './json_parameter';
import { CalendarDate, CalendarDateType } from './calendar_date';

function allDaysInMonth(year: number, month: number): Array<CalendarDateType> {
  let days = [];
  const date = CalendarDate(year, month, 1)

  for (let i = 1; i <= date.lastDayOfMonth(); i++) {
    days.push(CalendarDate(year, month, i));
  }

  return days;
}

export type MonthTable = {
  [key: string]: Array<DayData>;
}

export type DayData = {
  day: number;
  scheduled: number;
  actual: number;
  isHoliday: boolean;
}

export class DayObject implements DayData {
  constructor(public scheduled: number, public actual: number, public day: number, public isHoliday: boolean) { }

  isWorked(): boolean {
    return Number(this.actual) > 0;
  }

  isWorkingDay(): boolean {
    return !this.isHoliday;
  }

  scheduledHour(): number {
    return Number(this.scheduled);
  }

  actualHour(): number {
    return Number(this.actual);
  }

  isInvalid(): boolean {
    return isNaN(this.scheduledHour()) || isNaN(this.actualHour());
  }

  // NOTE: firestoreに保存するためにオブジェクトに変換する
  toObject(): DayData {
    return { day: this.day, scheduled: this.scheduled, actual: this.actual, isHoliday: this.isHoliday };
  }
}

export class DaysGenerator {
  static execute(year: number, month: number, standardTime: number, workingWeek: Week): Array<DayData> {
    const date = CalendarDate(year, month, 1)
    const datesInMonth = allDaysInMonth(date.year(), date.month());
    const workingDays = datesInMonth.filter((date) => workingWeek[date.weekDayName()]);
    // NOTE: 稼働日に祝日がある場合は、稼働対象外にする
    const nationalHolidays = datesInMonth.filter((date) => { return (date.isNationalHoliday() && workingWeek[date.weekDayName()]); });
    const avgHour = Number((standardTime / (workingDays.length - nationalHolidays.length)).toFixed(1));

    return datesInMonth.map((date) => {
      const isNationalHoliday =  date.isNationalHoliday()
      if(workingWeek[date.weekDayName()]) {
        return new DayObject(avgHour, 0, date.day(), isNationalHoliday).toObject()
      } else {
        return new DayObject(0, 0, date.day(), false).toObject()
      }
    });
  }

  static executeWithDays(year: number, month: number, standardTime: number, workingWeek: Week, dayObjects: Array<DayObject>): Array<DayData> {
    const holidays = dayObjects.filter((day) => { return day.isHoliday; });
    const date = CalendarDate(year, month, 1)
    const datesInMonth = allDaysInMonth(date.year(), date.month());
    const workingDays = datesInMonth.filter((date) => { return workingWeek[date.weekDayName()]; });
    const workedDays = dayObjects.filter((day) => { return day.isWorked(); });
    const remain = standardTime - workedDays.reduce((sum, day) => { return sum + Number(day.actual) }, 0);
    const avgHour = Number((remain / (workingDays.length - workedDays.length - holidays.length)).toFixed(1));

    return datesInMonth.map((date) => {
      // NOTE: すでに登録されている日付を引っ張ってくる
      const dayObject = dayObjects.find((day) => { return day.day === date.day(); });

      // NOTE: 稼働済みの日は再計算の対象外
      if(dayObject.isWorked()) { return dayObject; }

      // NOTE: 稼働予定日は予定を埋める
      if(workingWeek[date.weekDayName()]) { return new DayObject(avgHour, dayObject.actual, date.day(), dayObject.isHoliday).toObject() }

      // NOTE: 稼働予定ではないので0を埋める
      return new DayObject(0, 0, date.day(), false).toObject()
    });
  }
}

import { WeekData, DayData } from '../types/calendar';
import { CalendarDate, CalendarDateType } from './calendar_date';

function allDaysInMonth(year: number, month: number): Array<CalendarDateType> {
  let days = [];
  const date = CalendarDate(year, month, 1)

  for (let i = 1; i <= date.lastDayOfMonth(); i++) {
    days.push(CalendarDate(year, month, i));
  }

  return days;
}

class DaysGenerator {
  static execute(year: number, month: number, standardTime: number, workingWeek: WeekData): Array<DayData> {
    const date = CalendarDate(year, month, 1)
    const datesInMonth = allDaysInMonth(date.year(), date.month());
    const workingDays = datesInMonth.filter((date) => { return workingWeek[date.weekDayName()]; });
    const avgHour = Number((standardTime / workingDays.length).toFixed(1));

    return datesInMonth.map((date) => {
      if(workingWeek[date.weekDayName()]) {
        return { scheduled: avgHour, actual: 0, day: date.day(), isHoliday: false }
      } else {
        return { scheduled: 0, actual: 0, day: date.day(), isHoliday: false }
      }
    });
  }

  static executeWithDays(year: number, month: number, standardTime: number, workingWeek: WeekData, days: Array<DayData>): Array<DayData> {
    const holidays = days.filter((day) => { return day.isHoliday; });
    const date = CalendarDate(year, month, 1)
    const datesInMonth = allDaysInMonth(date.year(), date.month());
    const workingDays = datesInMonth.filter((date) => { return workingWeek[date.weekDayName()]; });
    const workedDays = days.filter((day) => { return(day.actual > 0); });
    const remain = standardTime - workedDays.reduce((sum, day) => { return sum + Number(day.actual) }, 0);
    const avgHour = Number((remain / (workingDays.length - workedDays.length - holidays.length)).toFixed(1));

    return datesInMonth.map((date) => {
      const dayObject = days.find((day) => { return day.day === date.day(); });
      if(dayObject.actual > 0) {
        return { scheduled: dayObject.scheduled, actual: dayObject.actual, day: date.day(), isHoliday: dayObject.isHoliday }
      }

      if(workingWeek[date.weekDayName()]) {
        return { scheduled: avgHour, actual: dayObject.actual, day: date.day(), isHoliday: dayObject.isHoliday }
      } else {
        return { scheduled: 0, actual: 0, day: date.day(), isHoliday: false }
      }
    });
  }
}

export default DaysGenerator;

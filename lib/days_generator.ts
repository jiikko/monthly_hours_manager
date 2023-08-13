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
        return { scheduled: avgHour, actual: 0, day: date.day() }
      } else {
        return { scheduled: 0, actual: 0, day: date.day() }
      }
    });
  }

  static executeWithDays(year: number, month: number, standardTime: number, workingWeek: WeekData, days: Array<DayData>): Array<DayData> {
    const date = CalendarDate(year, month, 1)
    const datesInMonth = allDaysInMonth(date.year(), date.month());
    const workingDays = datesInMonth.filter((date) => { return workingWeek[date.weekDayName()]; });
    const workedDays = days.filter((day) => { return(day.actual > 0); });
    const remain = standardTime - workedDays.reduce((sum, day) => { return sum + day.actual }, 0);
    const avgHour = Number((remain / (workingDays.length - workedDays.length)).toFixed(1));

    return datesInMonth.map((date) => {
      if(workingWeek[date.weekDayName()]) {
        const day = days.find((day) => { return day.day === date.day(); });
        return { scheduled: avgHour, actual: day.actual, day: date.day() }
      } else {
        return { scheduled: 0, actual: 0, day: date.day() }
      }
    });
  }
}

export default DaysGenerator;

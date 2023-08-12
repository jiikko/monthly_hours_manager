import { WeekData, DayData } from '../types/calendar';
import { CalendarDate } from './calendar_date';

function allDaysInMonth(year, month) {
  let days = [];
  const date = CalendarDate(year, month, 1)

  for (let i = 1; i <= date.lastDayOfMonth(); i++) {
    days.push(new Date(year, month -1, i));
  }

  return days;
}

class DaysGenerator {
  static execute(year: number, month: number, standardTime: number, workingDays: WeekData): Array<DayData> {
    const date = CalendarDate(year, month, 1)
    const days = allDaysInMonth(date.year(), date.month());
    return days.map((day) => {
      return { scheduled: 0, actual: 0, day: day.getDate() }
    });
  }
}

export default DaysGenerator;

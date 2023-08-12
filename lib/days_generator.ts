import { WeekData, DayData } from '../types/calendar';
import { allDaysInMonth } from './calendar';
import { CalendarDate } from './calendar_date';

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

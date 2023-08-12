import { WeekData, DayData } from '../types/calendar';
import { allDaysInMonth } from './calendar';

class DaysGenerator {
  static execute(year: number, month: number, standardTime: number, workingDays: WeekData): Array<DayData> {
    const days = allDaysInMonth(new Date(year, month, 1));
    return days.map((day) => {
      return { scheduled: 0, actual: 0, day: day.getDate() }
    });
  }
}

export default DaysGenerator;

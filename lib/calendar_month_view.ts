import {CalendarDate} from 'lib/calendar_date';

export type WeekInfo = {
  dayNumber: number | null;
  index: number;
};

export class CalendarMonthView {
  private year: number;
  private month: number;

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  headerWeeks(): string[] {
    return ['日', '月', '火', '水', '木', '金', '土'];
  }

  bodyWeeks(): WeekInfo[][] {
    const date = CalendarDate(this.year, this.month, 1);
    const firstDayOfMonth = date.firstWeekDayOfMonth();
    const daysInMonth = date.lastDayOfMonth();
    const calendarInfo = this.generateMonthDays(firstDayOfMonth, daysInMonth);
    return this.generateWeekRows(calendarInfo);
  }

  private generateMonthDays(firstDayOfMonth: number, daysInMonth: number): Array<number | null> {
    const totalDays = 6 * 7;
    let dayCount = 1;
    return Array.from({ length: totalDays }, (_, index) => {
      if (index < firstDayOfMonth || dayCount > daysInMonth) {
        return null;
      } else {
        return dayCount++;
      }
    });
  }

  private generateWeekRows(calendarInfo: Array<number | null>): WeekInfo[][] {
    const calendarRows: WeekInfo[][] = [];
    for (let i = 0; i < calendarInfo.length; i += 7) {
      const week = calendarInfo.slice(i, i + 7).map((dayNumber, index) => {
        return { dayNumber, index };
      });
      calendarRows.push(week);
    }
    return calendarRows;
  }
}

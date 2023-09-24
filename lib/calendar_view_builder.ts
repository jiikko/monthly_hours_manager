import { CalendarDate } from 'lib/calendar_date';

export type WeekInfo = {
  dayNumber: number | null;
  index: number;
};

export interface CalendarViewBuilderReturnType {
  headerWeeks: () => string[];
  bodyWeeks: () => WeekInfo[][];
}

export type CalendarViewBuilderType = (year: number, month: number) => CalendarViewBuilderReturnType;

export const CalendarViewBuilder: CalendarViewBuilderType = (() => {
  return function (year: number, month: number) {
    const headerWeeks = () => {
      return(
        ['日', '月', '火', '水', '木', '金', '土']
      )
    }

    const bodyWeeks = () => {
      const date = CalendarDate(year, month, 1);
      const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
      const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
      const calendarInfo = generateMonthDays(firstDayOfMonth, daysInMonth);
      return generateWeekRows(calendarInfo);
    }

    const generateMonthDays = (firstDayOfMonth: number, daysInMonth: number): Array<number | null> => {
      const totalDays = 6 * 7; // 最大6週間 x 7日
      let dayCount = 1;
      const calendarInfo = Array.from({ length: totalDays }, (_, index) => {
        if (index < firstDayOfMonth || dayCount > daysInMonth) {
          return null;
        } else {
          return dayCount++;
        }
      });

      return calendarInfo as any;
    };

    const generateWeekRows = (calendarInfo) => {
      const calendarRows = [];
      for (let i = 0; i < calendarInfo.length; i += 7) {
        const week = calendarInfo.slice(i, i + 7).map((dayNumber: number, index: number) => {
          return { dayNumber, index };  // 必要な情報だけを返す
        });
        calendarRows.push(week);
      }
      return calendarRows;
    };

    return {
      headerWeeks,
      bodyWeeks,
    }
  }
})()

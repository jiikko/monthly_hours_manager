import {CalendarMonthTemplate} from 'components/calendar_month_template';
import {Calendar, Week} from 'lib/calendar';
import {CalendarDate} from 'lib/calendar_date';
import {CalendarViewBuilder} from 'lib/calendar_view_builder';
import {DayObject} from 'lib/days_generator';

type Props = {
  year: number;
  month: number;
  calendars: Array<Calendar>;
}
type HandleUpdateDayType = (attributeName: string, value: boolean | string, dayIndex: number) => void;

export const AllCalendarMonth: React.FC<Props>= ({ year, month, calendars }) => {
  const builder = CalendarViewBuilder(year, month);
  const date = CalendarDate(Number(year), Number(month), 1);
  const monthKey = date.monthlyKey();

  const handleUpdateDay = (attributeName: string, value: boolean | string, dayIndex: number) => {}
  const tDBody = (dayNumber: number | null, index: number, days: Array<DayObject | Calendar>, workingWeek: Week, handleUpdateDay: HandleUpdateDayType) => {
    if(dayNumber === null) { return <td key={index}></td> }
    let calendarDate = CalendarDate(year, month, dayNumber);

    return(
      <td key={index}>
        {dayNumber}日{calendarDate.isNationalHoliday() && '(祝)'}<br />
      </td>
    )
  }

  return(
    <>
      <h1>集約した{year}年{month}月のカレンダー</h1>
      <CalendarMonthTemplate builder={builder} days={calendars} workingWeek={{} as any} handleUpdateDay={handleUpdateDay} tDBody={tDBody} />
    </>
  )
}

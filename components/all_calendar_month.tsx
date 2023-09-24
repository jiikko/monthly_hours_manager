import {CalendarViewBuilder} from 'lib/calendar_view_builder';
import {CalendarMonthTemplate} from 'components/calendar_month_template';
import {Week} from 'lib/calendar';
import {CalendarDate} from 'lib/calendar_date';
import {DayObject} from 'lib/days_generator';

type Props = {
  year: number;
  month: number;
  days: Array<DayObject>;
}

export const AllCalendarMonth: React.FC<Props>= ({ year, month, days }) => {
  const builder = CalendarViewBuilder(year, month);
  const workingWeek = {} as any;
  const handleUpdateDay = (attributeName: string, value: boolean | string, dayIndex: number) => {}
  const tDBody = (dayNumber: number | null, index: number, days: Array<DayObject>, workingWeek: Week, handleUpdateDay: HandleUpdateDayType) => {
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
      <CalendarMonthTemplate builder={builder} days={days} workingWeek={workingWeek} handleUpdateDay={handleUpdateDay} tDBody={tDBody} />
    </>
  )
}

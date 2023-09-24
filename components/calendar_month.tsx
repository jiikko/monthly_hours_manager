import {CalendarMonthTemplate} from 'components/calendar_month_template';
import {Week} from 'lib/calendar';
import {CalendarDate} from 'lib/calendar_date';
import {CalendarViewBuilder} from 'lib/calendar_view_builder';
import {DayObject} from 'lib/days_generator';
import {FloatingLabel, Form} from 'react-bootstrap';

type CalendarMonthData = {
  name: string;
  days: Array<DayObject>;
}

type HandleUpdateDayType = (attributeName: string, value: boolean | string, dayIndex: number) => void;
type MonthProps = {
  year: number;
  month: number;
  monthDataList: Array<CalendarMonthData>;
  days: Array<DayObject>;
  workingWeek: Week;
  handleUpdateDay: (attributeName: string, value: boolean | string, dayIndex: number) => void;
}

export const CalendarMonth: React.FC<MonthProps>= ({ year, month, days, workingWeek, handleUpdateDay, monthDataList }) => {
  const builder = CalendarViewBuilder(year, month);
  const tDBody = (dayNumber: number | null, index: number, days: Array<DayObject>) => {
    if(dayNumber === null) { return <td key={index}></td> }
    let dayIndex = dayNumber - 1;
    let day = monthDataList[0].days[dayIndex];
    let calendarDate = CalendarDate(year, month, dayNumber);
    let tdClassName = (workingWeek[calendarDate.weekDayName()]) ? 'bg-info' : 'bg-secondary text-light';
    if(Number(day.actual)) { tdClassName = 'bg-success text-light' }
    if(day.isHoliday) { tdClassName = 'bg-secondary text-light' }
    if(day.isInvalid()) { tdClassName = 'bg-warning text-light' }

    return(
      <td key={index} className={tdClassName}>
        {dayNumber}日{calendarDate.isNationalHoliday() && '(祝)'}<br />

        <Form>
          <Form.Check type="switch" checked={day.isHoliday} name={'isHoliday'}  label="稼働対象外" className='m-1' onChange={(e) => handleUpdateDay('isHoliday', e.target.checked, dayIndex) } />
          {day.isWorkingDay() && (
            <>
              <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
                <Form.Control type="text" value={day.scheduled} name={'scheduled'} onChange={(e) => handleUpdateDay('scheduled', e.target.value, dayIndex)} />
              </FloatingLabel>
              <FloatingLabel controlId="floatingInput" label="実績" >
                <Form.Control type="text" value={day.actual} name={'actual'} onChange={(e) => handleUpdateDay('actual', e.target.value, dayIndex)} />
              </FloatingLabel>
            </>
          )}
        </Form>
      </td>
    )
  }

  return (
    <CalendarMonthTemplate builder={builder} days={days} tDBody={tDBody} />
  );
};

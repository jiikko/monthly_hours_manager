import {Week} from 'lib/calendar';
import {CalendarDate} from 'lib/calendar_date';
import {DayObject} from 'lib/days_generator';
import {FloatingLabel, Form, Table} from 'react-bootstrap';

type MonthProps = {
  year: number;
  month: number;
  days: Array<DayObject>;
  workingWeek: Week;
  handleUpdateDay: (attributeName: string, value: boolean | string, dayIndex: number) => void;
}

const generateMonthDays = (firstDayOfMonth, daysInMonth): Array<{ dayNumber: number | null }> => {
  const totalDays = 6 * 7; // 最大6週間 x 7日
  let dayCount = 1;
  const calendarInfo = Array.from({ length: totalDays }, (_, index) => {
    if (index < firstDayOfMonth || dayCount > daysInMonth) {
      return { dayNumber: null };
    } else {
      return { dayNumber: dayCount++ };
    }
  });

  return calendarInfo as any;
};

const generateWeekRows = (calendarInfo, handleUpdateDay, year, month) => {
  const calendarRows = [];
  for (let i = 0; i < calendarInfo.length; i += 7) {
    const week = calendarInfo.slice(i, i + 7).map(({ dayNumber }, index) => {
      return { dayNumber, index };  // 必要な情報だけを返す
    });
    calendarRows.push(week);
  }
  return calendarRows;
};

export const CalendarMonth: React.FC<MonthProps>= ({ year, month, days, workingWeek, handleUpdateDay }) => {
  const date = CalendarDate(year, month, 1);
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarInfo = generateMonthDays(firstDayOfMonth, daysInMonth);
  const weeks = generateWeekRows(calendarInfo, handleUpdateDay, year, month);

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>日</th>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th>土</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map(({ dayNumber, index }) => {
                if(dayNumber === null) { return <td key={index}></td> }
                let dayIndex = dayNumber - 1;
                let day = days[dayIndex];
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
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

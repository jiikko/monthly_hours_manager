import { DayObject } from 'lib/days_generator';
import { CalendarDate } from 'lib/calendar_date';
import { Week } from 'lib/calendar';
import { Table, Form, FloatingLabel } from 'react-bootstrap';

type MonthProps = {
  year: number;
  month: number;
  days: Array<DayObject>;
  workingWeek: Week;
  handleUpdateDay: (attributeName: string, value: boolean | string, dayIndex: number) => void;
}

export const CalendarMonth: React.FC<MonthProps>= ({ year, month, days, workingWeek, handleUpdateDay }) => {
  const date = CalendarDate(year, month, 1);
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarRows = [];

  let dayCount = 1;

  for (let i = 0; i < 6; i++) { // 最大6週間
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
        week.push(<td key={j}></td>);
      } else {
        const dayNo = dayCount++; // 1から始まる
        const dayIndex = dayNo - 1;
        const day = days[dayIndex];
        const calendarDate = CalendarDate(year, month, dayNo);

        let tdClassName = (workingWeek[calendarDate.weekDayName()]) ? 'bg-info' : 'bg-secondary text-light';
        if(Number(day.actual)) { tdClassName = 'bg-success text-light' }
        if(day.isHoliday) { tdClassName = 'bg-secondary text-light' }
        if(day.isInvalid()) { tdClassName = 'bg-warning text-light' }

        const row = (
          <td key={j} className={tdClassName}>
            {dayNo}日{calendarDate.isNationalHoliday() && '(祝)'}<br />

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
        week.push(row)
      }
    }

    calendarRows.push(<tr key={i}>{week}</tr>);
  }

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
        <tbody>{calendarRows}</tbody>
      </Table>
    </>
  );
};

import {CalendarMonthTemplate} from 'components/calendar_month_template';
import {Calendar} from 'lib/calendar';
import {CalendarDate} from 'lib/calendar_date';
import {CalendarMonthData} from 'lib/calendar_month_data';
import {CalendarMonthView} from 'lib/calendar_month_view';
import Link from 'next/link';
import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';

type Props = {
  year: number;
  month: number;
  calendars: Array<Calendar>;
}

export const AllCalendarMonth: React.FC<Props>= ({ year, month, calendars }) => {
  const builder = new CalendarMonthView(year, month)
  const date = CalendarDate(Number(year), Number(month), 1);
  const monthKey = date.monthlyKey();

  const monthDataList = calendars.map((c) => {
    const days = c.months[monthKey]
    if(days === undefined) { return null }
    return { name: c.name, days: c.months[monthKey] } }
  ).filter((item) => item) as Array<CalendarMonthData>

  const tDBody = (dayNumber: (number | null), index: number) => {
    if(dayNumber === null) { return <td key={index}></td> }

    const dayIndex = dayNumber - 1;
    const calendarDate = CalendarDate(year, month, dayNumber);

    return(
      <td key={index}>
        {dayNumber}日{calendarDate.isNationalHoliday() && '(祝)'}<br />
        {
          monthDataList.map((monthData, i) => (
            <React.Fragment key={i}>
              {`${monthData.name}: ${monthData.days[dayIndex].scheduled}時間`}
              <br />
            </React.Fragment>
          ))
        }
      </td>
    )
  }

  return (
    <>
      <h1>{year}年{month}月予定の総合カレンダー</h1>

      <Row className='mb-3 mt-3'>
        {calendars.map((calendar) => (
          <Col className="text-end" key={calendar.id}>
            <Link href={`/v2/calendars/${calendar.id}/${year}/${month}`}>
              <Button>{calendar.name}のカレンダー</Button>
            </Link>
          </Col>
        ))}
      </Row>

      <CalendarMonthTemplate builder={builder} tDBody={tDBody} />
    </>
  )
}

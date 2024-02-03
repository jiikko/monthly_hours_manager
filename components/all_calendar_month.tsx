import { CalendarMonthTemplate } from "components/calendar_month_template";
import { Calendar } from "lib/calendar";
import { CalendarDate } from "lib/calendar_date";
import { CalendarMonthData } from "lib/calendar_month_data";
import { CalendarMonthView } from "lib/calendar_month_view";
import { DayObject } from "lib/days_generator";
import Link from "next/link";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";

type Props = {
  year: number;
  month: number;
  calendars: Array<Calendar>;
};

export const AllCalendarMonth: React.FC<Props> = ({
  year,
  month,
  calendars,
}) => {
  const builder = new CalendarMonthView(year, month);
  const date = CalendarDate(Number(year), Number(month), 1);
  const monthKey = date.monthlyKey();

  const monthDataList = calendars
    .map((c) => {
      const days = c.months[monthKey];
      if (days === undefined) {
        return null;
      }
      return { name: c.name, days: c.months[monthKey] };
    })
    .filter((item) => item) as Array<CalendarMonthData>;

  const tDBody = (dayNumber: number | null, index: number) => {
    if (dayNumber === null) {
      return <td key={index}></td>;
    }

    const dayIndex = dayNumber - 1;
    const calendarDate = CalendarDate(year, month, dayNumber);
    monthDataList.forEach((monthData) => {
      const day = monthData.days[dayIndex];
      const dayObj = new DayObject(
        day.scheduled,
        day.actual,
        day.day,
        day.isHoliday
      );
      monthData.days[dayIndex] = dayObj;
    });
    const totalHours = monthDataList.reduce((accumulator, currentValue) => {
      const day = currentValue.days[dayIndex];
      return accumulator + day.scheduledHour();
    }, 0);
    let tdClassName = "table-";
    if (totalHours === 8) {
      tdClassName += "success";
    } else if (totalHours > 8) {
      tdClassName += "danger";
    } else {
      tdClassName += "success";
    }

    return (
      <td key={index} className={tdClassName}>
        {dayNumber}日{calendarDate.isNationalHoliday() && "(祝)"}(合計
        {totalHours}h)
        <br />
        <ul className="list-group">
          {monthDataList.map((monthData, i) => (
            <li key={i} className="list-group-item">
              {monthData.name}: {monthData.days[dayIndex].scheduledHour()}h
            </li>
          ))}
        </ul>
      </td>
    );
  };

  return (
    <>
      <h1>
        {year}年{month}月予定の総合カレンダー
      </h1>

      <Row className="mb-3 mt-3">
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
  );
};

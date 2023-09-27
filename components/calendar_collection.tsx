import { CalendarDate, CalendarDateType } from 'lib/calendar_date';
import { Button, Row, Col, Table, Nav } from 'react-bootstrap';
import { MonthCalculator } from 'lib/month_calculator';
import { Calendar } from 'lib/calendar';
import { PathGenerator } from 'lib/path_generator';
import Link from 'next/link';

type Props = {
  calendars: Array<Calendar>;
}

export const CalendarCollection: React.FC<Props>= ({ calendars }) => {
  const date = CalendarDate();
  const dateOnNextMonth = date.nextDateOnMonth();
  const pathGenerator = PathGenerator()
  const renderMonthSummary = (calendar: Calendar, date: CalendarDateType) => {
    const days = calendar.months[date.monthlyKey()]
    if(days === undefined) { return null }

    return (
      <>
        予定: {calculateTime(calendars, date.monthlyKey(), 'totalScheduled')}時間<br/>
        実績: {calculateTime(calendars, date.monthlyKey(), 'totalActual')}時間
      </>
    );
  }
  const calculateTime = (calendars: Array<Calendar>, dateKey: string, method: string): number => {
    return calendars.reduce((total, calendar) => {
      const days = calendar.months[dateKey];
      const monthCalculator = new MonthCalculator(days);
      return total + monthCalculator[method]();
    }, 0);
  };

  return (
    <>
      <h1 className='mb-4'>作成したカレンダーの一覧</h1>

      <Table>
        <thead>
          <tr>
            <th>カレンダー名</th>
            <th>基準時間</th>
            <th>稼働曜日</th>
            <th>作成日</th>
            <th>
              <Link href={`/v2/calendars/all/${date.year()}/${date.month()}`} className='text-decoration-underline'>
                今月({date.month()}月)
              </Link>
            </th>
            <th>
              <Link href={`/v2/calendars/all/${dateOnNextMonth.year()}/${dateOnNextMonth.month()}`} className='text-decoration-underline'>
              来月({dateOnNextMonth.month()}月)
              </Link>
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {calendars.map((calendar, index) => (
            <tr key={index}>
              <td>{calendar.name}</td>
              <td>{calendar.standardTime}時間</td>
              <td>
                {calendar.week.format()}
              </td>
              <td>
                {calendar.formattedCreatedAt()}
              </td>
              <td>
                <Nav.Link as={Link} href={pathGenerator.monthPathV2(calendar.id, date.year(), date.month())}>
                  <Button variant='info'>表示する</Button>
                </Nav.Link>
                {renderMonthSummary(calendar, date)}
              </td>
              <td>
                <Nav.Link as={Link} href={pathGenerator.monthPathV2(calendar.id, date.year(), date.nextMonth())}>
                  <Button variant='info'>表示する</Button>
                </Nav.Link>
                {renderMonthSummary(calendar, dateOnNextMonth)}
              </td>
              <td>
                <Link href={`/v2/calendars/${calendar.id}/months`}>
                  <Button>月一覧</Button>
                </Link>
              </td>
              <td>
                <Link href={`/v2/calendars/${calendar.id}/edit`}>
                  <Button>編集</Button>
                </Link>
              </td>
            </tr>
          ))}
          <tr className='table-info'>
              <td>合計</td>
              <td>{calendars.reduce((a, b) => a + b.standardTime, 0)}時間</td>
              <td></td>
              <td></td>
              <td>
                予定: {calculateTime(calendars, date.monthlyKey(), 'totalScheduled')}時間<br/>
                実績: {calculateTime(calendars, date.monthlyKey(), 'totalActual')}時間
              </td>
              <td>
                予定: {calculateTime(calendars, dateOnNextMonth.monthlyKey(), 'totalScheduled')}時間<br/>
                実績: {calculateTime(calendars, dateOnNextMonth.monthlyKey(), 'totalActual')}時間
              </td>
              <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>

      <Row>
        <Col className="text-end">
          <Link href={`/v2/calendars/new`}>
            <Button>新しいカレンダーを作成する</Button>
          </Link>
        </Col>
      </Row>
    </>
  )
}

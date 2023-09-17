import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col, Table, Nav } from 'react-bootstrap';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/auth_context'
import { Calendar } from 'lib/calendar';
import { CalendarDate, CalendarDateType } from 'lib/calendar_date';
import { PathGenerator } from 'lib/path_generator';
import Link from 'next/link';
import { useManageCalendar } from 'hooks/use_manage_calendar';
import { MonthCalculator } from 'lib/month_calculator';

const Page: NextPageWithLayout = () => {
  const { user } = useContext(AuthContext);
  const [calendars, setCalendars] = useState<Calendar[]>(undefined);
  const { fetchCalendars } = useManageCalendar();
  const date = CalendarDate();
  const dateOnNextMonth = date.nextDateOnMonth();
  const pathGenerator = PathGenerator()

  useEffect(() => {
    fetchCalendars(user).then((calendars) => {
      setCalendars(calendars)
    })
  }, [])

  if(calendars === undefined) { return null }

  const renderMonthSummary = (calendar: Calendar, date: CalendarDateType) => {
    const days = calendar.months[date.monthlyKey()]
    if(days === undefined) { return null }

    const monthCalculator = new MonthCalculator(days);
    return (
      <>
        予定: {monthCalculator.totalScheduled()}<br/>
        実績: {monthCalculator.totalActual()}
      </>
    );
  }

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
            <th>今月({date.month()}月)</th>
            <th>来月({date.nextMonth()}月)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {calendars.map((calendar, index) => (
            <tr key={index}>
              <td>{calendar.name}</td>
              <td>{calendar.standardTime}時間</td>
              <td>
                {calendar.week.formatted()}
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
                <Link href={`/v2/calendars/${calendar.id}/edit`}>
                  <Button>編集</Button>
                </Link>
              </td>
            </tr>
          ))}
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

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

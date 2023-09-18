import type { NextPageWithLayout } from 'pages/_app'
import { CalendarContext } from 'contexts/calendar_context';
import { Layout } from 'layouts/v2';
import { RequiredCalendar } from 'layouts/required_calendar';
import { RequiredUser } from 'layouts/required_user';
import { useContext } from 'react';
import { useCurrentUser } from 'hooks/use_current_user';
import { Table, Row, Col, Button  } from 'react-bootstrap';
import Link from 'next/link';
import { MonthCalculator } from 'lib/month_calculator';
import { useManageCalendar } from 'hooks/use_manage_calendar';
import { toast } from 'react-toastify';

const Page: NextPageWithLayout = () => {
  const { user } = useCurrentUser()
  const { calendar, calendar_id } = useContext(CalendarContext);
  const { updateMonths } = useManageCalendar();
  const handleDeleteCalendarMonth = (monthKey: string): void => {
    const result = confirm('月を削除しますか？');
    if(!result) { return; }

    delete calendar.months[monthKey];
    updateMonths(calendar, user, calendar_id, monthKey);
    toast(`${monthKey}を削除しました`);
  }

  return (
    <>
      <Row className='mb-3'>
        <Col>
          <h1>{calendar.name}カレンダーの月一覧</h1>
        </Col>

        <Col className="text-end mt-3">
          <Link href={`/v2/calendars/${calendar.id}/edit`}>
            <Button>カレンダーの編集</Button>
          </Link>
        </Col>
      </Row>

      <Table>
        <thead>
          <tr>
            <th>年月</th>
            <th>予定時間</th>
            <th>実績時間</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
            {Object.keys(calendar.months).map((key) => {
              return(
                <tr key={key}>
                  <td>{key}</td>
                  <td>{new MonthCalculator(calendar.months[key]).totalScheduled()}時間</td>
                  <td>{new MonthCalculator(calendar.months[key]).totalActual()}時間</td>
                  <td>
                    <Link href={`/v2/calendars/${calendar_id}/${key.split('-')[0]}/${key.split('-')[1] }`}>
                      <Button>詳細</Button>
                    </Link>
                  </td>

                  <td>
                    <Button variant='danger' onClick={(_) => handleDeleteCalendarMonth(key)}>削除</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
      </Table>
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        <RequiredCalendar>
          {page}
        </RequiredCalendar>
      </RequiredUser>
    </Layout>
  )
}

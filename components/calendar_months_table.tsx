import {Calendar} from 'lib/calendar';
import Link from 'next/link';
import {Button, Col, Row, Table} from 'react-bootstrap';

type Props = {
  calendar: Calendar;
  handleDeleteCalendarMonth: (monthKey: string) => void;
};

export const CalendarMonthsTable: React.FC<Props> = ({ calendar, handleDeleteCalendarMonth }) => {
  return(
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
                <td>{calendar.sumByMonth(key, 'totalScheduled')}時間</td>
                <td>{calendar.sumByMonth(key, 'totalActual')}時間</td>
                <td>
                  <Link href={`/v2/calendars/${calendar.id}/${key.split('-')[0]}/${key.split('-')[1] }`}>
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

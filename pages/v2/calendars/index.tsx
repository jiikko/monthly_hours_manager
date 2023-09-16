import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col, Table, Nav } from 'react-bootstrap';
import { useReducer, useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/auth_context'
import { db } from "../../../lib/firebase";
import { getDocs, runTransaction, collection, query } from 'firebase/firestore';
import { Calendar } from '../../../lib/calendar';
import { CalendarDate } from '../../../lib/calendar_date';
import { PathGenerator } from '../../../lib/path_generator';
import Link from 'next/link';

const Page: NextPageWithLayout = () => {
  const { user } = useContext(AuthContext);
  const [calendars, setCalendars] = useState<Calendar[]>(undefined);
  const weekDayMapping = {
    "sun": "日曜日",
    "mon": "月曜日",
    "tue": "火曜日",
    "wed": "水曜日",
    "thu": "木曜日",
    "fri": "金曜日",
    "sat": "土曜日"
  };
  const weekDayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const date = CalendarDate();
  const pathGenerator = PathGenerator()

  useEffect(() => {
    const fetchCalendars = async (user) => {
      const q = query(collection(db, `time-manager-v2/${user.uid}/calendars`));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const calendar = new Calendar(data.name, data.standardTime, data.week, data.months, false, doc.id)
        list.push(calendar);
      });
      setCalendars(list)
    }

    if(user) {
      fetchCalendars(user)
    }
  }, [user])

  if(!user) { return null }
  if(calendars === undefined) { return null }

  return (
    <>
      <h1 className='mb-4'>作成したカレンダーの一覧</h1>

      <Table>
        <thead>
          <tr>
            <th>カレンダー名</th>
            <th>基準時間</th>
            <th>稼働曜日</th>
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
                {weekDayOrder.filter(key => calendar.week[key]).map(key => weekDayMapping[key]).join(', ')}
              </td>
              <td>
                <Nav.Link as={Link} href={pathGenerator.monthPathV2(calendar.id, date.year(), date.month())}>
                  <Button variant='info'>表示する</Button>
                </Nav.Link>
              </td>
              <td>
                <Nav.Link as={Link} href={pathGenerator.monthPathV2(calendar.id, date.year(), date.nextMonth())}>
                  <Button variant='info'>表示する</Button>
                </Nav.Link>
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

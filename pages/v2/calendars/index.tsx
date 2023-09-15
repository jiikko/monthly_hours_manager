import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col, Table } from 'react-bootstrap';
import { useReducer, useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/auth_context'
import { db } from "../../../lib/firebase";
import { getDocs, runTransaction, collection, query } from 'firebase/firestore';
import { Calendar } from '../../../lib/calendar';

const Page: NextPageWithLayout = () => {
  const { user } = useContext(AuthContext);
  const [calendars, setCalendars] = useState([]);
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

return (
  <>
    <h1>カレンダーの一覧</h1>

    <Table>
      <thead>
        <tr>
          <th>カレンダー名</th>
          <th>基準時間</th>
          <th>稼働曜日</th>
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
              <Button href={`/v2/calendars/${calendar.id}/edit`}>編集</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <hr />

    <Row>
      <Col className="text-end">
        <Button href="/v2/calendars/new">新しいカレンダーを作成する</Button>
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

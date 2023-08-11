import { useRouter } from 'next/router';
import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import JsonParameter from '../lib/json_parameter';

type Props = {
  workingDays: any;
}

const Calendar: React.FC = ({ workingDays }: Props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit')
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0から11の値

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 月の最終日の日付を取得

  const calendarRows = [];

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  let dayCount = 1;

  for (let i = 0; i < 6; i++) { // 最大6週間
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
        week.push(<td key={j}></td>);
      } else {
        const dayNo = dayCount++
        const date = new Date(year, month, dayNo);
        const dayOfWeek = date.getDay();
        const youbi = days[dayOfWeek]
        const className = (workingDays[youbi]) ? 'bg-info' : 'bg-secondary';

        var row = <td key={j} className={className}>
          {dayNo}日<br />
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
              <Form.Control type="name" defaultValue={''} onChange={(e) => e} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="実績" >
              <Form.Control type="name" defaultValue={''} onChange={(e) => e} />
            </FloatingLabel>
          </Form>
        </td>
      week.push(row)
      }
    }

    calendarRows.push(<tr key={i}>{week}</tr>);
  }

  return (
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
  );
};

const CurrentMonth: NextPageWithLayout = () => {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(router.query);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  if(jsonObject.week == undefined) {
    return(
      <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  return(
    <>
      <h1>{year}年{month}月の稼働表</h1>
      <Calendar workingDays={jsonObject.week}/>
    </>
  )
}
export default CurrentMonth

CurrentMonth.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

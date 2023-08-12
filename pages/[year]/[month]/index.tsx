import DaysGenerator from '../../../lib/days_generator';
import JsonParameter from '../../../lib/json_parameter';
import Layout from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { WeekData, DayData, MonthTable } from '../../../types/calendar';
import { useRouter } from 'next/router';

type MonthProps = {
  workingDays: WeekData;
  days: Array<DayData>;
  onDayUpdate: (e: any, dayObject: DayData) => void;
}

const Month: React.FC<MonthProps>= ({ workingDays, days, onDayUpdate }) => {
  const date = CalendarDate();
  const year = date.year();
  const month = date.month();
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarRows = [];
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  let dayCount = 1;

  for (let i = 0; i < 6; i++) { // 最大6週間
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
        week.push(<td key={j}></td>);
      } else {
        const dayNo = dayCount++; // 1スタート
        const dayIndex = dayNo - 1;
        const date = CalendarDate(year, month, dayNo);
        const dayOfWeek = date.weekDay()
        const youbi = weekDays[dayOfWeek]
        const className = (workingDays[youbi]) ? 'bg-info' : 'bg-secondary text-light';
        const dayObject = days[dayIndex]

        var row = <td key={j} className={className}>
          {dayNo}日<br />
          <Form>
            <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
              <Form.Control type="name" defaultValue={dayObject.scheduled} name={`scheduled-${dayIndex}`} onChange={(e) => onDayUpdate(e, dayObject)} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="実績" >
              <Form.Control type="name" defaultValue={dayObject.actual} name={`actual-${dayIndex}`} onChange={(e) => onDayUpdate(e, dayObject)} />
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


const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));

  if(jsonObject.week == undefined) {
    return(
      <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  const date = CalendarDate(year, month, 1);
  const monthKey = date.monthlyKey();

  if(jsonObject.months == undefined) { jsonObject.months = {} as MonthTable; }
  if(jsonObject.months[monthKey] == undefined) {
    jsonObject.months[monthKey] = DaysGenerator.execute(date.year(), date.month(), jsonObject.standardTime, jsonObject.week);
    const jsonQuery = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
    router.push(`/${year}/${month}?${jsonQuery}`) // TODO: pathメソッドで置き換える
  }

  const onDayUpdate = (e: any, dayObject: DayData) => {
    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    const days = jsonObject.months[monthKey];
    const attribute_name = e.target.name.split('-')[0];
    const dayIndex = e.target.name.split('-')[1];

    days[dayIndex][attribute_name] = Number(e.target.value);
    const jsonQueryParams = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
    router.push(`/current_month?${jsonQueryParams}`);
    console.log('the day has been updated') // トーストで表示したい
  }

  return (
    <>
      <h1>{year}年{month}月</h1>
      <Month workingDays={jsonObject.week} days={jsonObject.months[monthKey]} onDayUpdate={onDayUpdate} />
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

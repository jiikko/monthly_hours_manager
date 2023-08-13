import DaysGenerator from '../../../lib/days_generator';
import JsonParameter from '../../../lib/json_parameter';
import Layout from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { WeekData, DayData, MonthTable, ParameterType } from '../../../types/calendar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PathGenerator } from '../../../lib/path_generator';

type MonthProps = {
  workingDays: WeekData;
  year: number;
  month: number;
  days: Array<DayData>;
  onDayUpdate: (e: any, dayObject: DayData) => void;
}

const Month: React.FC<MonthProps>= ({ workingDays, year, month, days, onDayUpdate }) => {
  const date = CalendarDate(year, month, 1);
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
        const dayNo = dayCount++; // 1から始まる
        const dayIndex = dayNo - 1;
        const dayOfWeek = CalendarDate(year, month, dayNo).weekDay();
        const weekDay = weekDays[dayOfWeek]
        const tdClassName = (workingDays[weekDay]) ? 'bg-info' : 'bg-secondary text-light';
        const dayObject = days[dayIndex]

        var row = <td key={j} className={tdClassName}>
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

  const saveQueryParam = (jsonObject: ParameterType) => {
    const jsonQuery = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
    const monthPath = PathGenerator().monthPath(date.year(), date.month(), jsonQuery)
    router.push(monthPath);
  }

  const onDayUpdate = (e: React.ChangeEvent<HTMLInputElement>, dayObject: DayData) => {
    const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
    const days = jsonObject.months[monthKey];
    const attributeName = e.target.name.split('-')[0];
    const dayIndex = e.target.name.split('-')[1];
    days[dayIndex][attributeName] = Number(e.target.value);
    saveQueryParam(jsonObject);
    console.log('the day has been updated') // トーストで表示したい
  }

  if(jsonObject.months == undefined) { jsonObject.months = {} as MonthTable; }
  if(jsonObject.months[monthKey] == undefined) {
    jsonObject.months[monthKey] = DaysGenerator.execute(date.year(), date.month(), jsonObject.standardTime, jsonObject.week);
    saveQueryParam(jsonObject);
    return;
  }

  const days = jsonObject.months[monthKey]
  const totalScheduled = days.reduce((sum, day) => sum + day.scheduled, 0);
  const diffScheduled = totalScheduled - jsonObject.standardTime;
  const totalScheduledClassName = (totalScheduled >= jsonObject.standardTime) ? 'text-white bg-success' : 'text-white bg-danger'; 
  const totalActual = days.reduce((sum, day) => sum + day.actual, 0);
  const diffActual = totalActual - jsonObject.standardTime;
  const totalActualClassName = (totalActual >= jsonObject.standardTime) ? 'text-white bg-success' : 'text-white bg-danger'; 

  return (
    <>
      <h1>{year}年{month}月</h1>
      <Month workingDays={jsonObject.week} year={Number(year)} month={Number(month)} days={days} onDayUpdate={onDayUpdate} />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>基準時間</th>
            <th className={totalScheduledClassName}>予定の合計</th>
            <th className={totalScheduledClassName}>予定の差分</th>
            <th className={totalActualClassName}>実績の合計</th>
            <th className={totalActualClassName}>実績の差分</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{jsonObject.standardTime}時間</td>
            <td className={totalScheduledClassName}>{totalScheduled}時間</td>
            <td className={totalScheduledClassName}>{diffScheduled}時間</td>
            <td className={totalActualClassName}>{totalActual}時間</td>
            <td className={totalActualClassName}>{diffActual}時間</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

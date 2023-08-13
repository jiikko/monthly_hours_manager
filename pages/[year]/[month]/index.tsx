import DaysGenerator from '../../../lib/days_generator';
import JsonParameter from '../../../lib/json_parameter';
import Layout from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { WeekData, DayData, MonthTable, ParameterType } from '../../../types/calendar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PathGenerator } from '../../../lib/path_generator';

type MonthProps = {
  workingWeek: WeekData;
  year: number;
  month: number;
  days: Array<DayData>;
  onDayUpdate: (e: any, day: DayData) => void;
}

const Month: React.FC<MonthProps>= ({ workingWeek, year, month, days, onDayUpdate }) => {
  const date = CalendarDate(year, month, 1);
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarRows = [];
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  let dayCount = 1;

  const renderTextFields = (day: DayData, dayIndex: number) => {
    return(
      <>
        <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
          <Form.Control type="name" value={day.scheduled} name={`scheduled-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="実績" >
          <Form.Control type="name" value={day.actual} name={`actual-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
        </FloatingLabel>
      </>
    )
  }


  for (let i = 0; i < 6; i++) { // 最大6週間
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
        week.push(<td key={j}></td>);
      } else {
        const dayNo = dayCount++; // 1から始まる
        const dayIndex = dayNo - 1;
        const weekDay = weekDays[CalendarDate(year, month, dayNo).weekDay()];
        const day = days[dayIndex];
        let tdClassName = (workingWeek[weekDay]) ? 'bg-info' : 'bg-secondary text-light';
        if(day.scheduled && day.actual) { tdClassName = 'bg-success text-light' }
        if(day.isHoliday) { tdClassName = 'bg-secondary text-light' }

        const row = (
          <td key={j} className={tdClassName}>
            {dayNo}日<br />
            <Form>
              {!day.isHoliday && renderTextFields(day, dayIndex, 'scheduled')}
              <Form.Check type="switch" checked={!!day.isHoliday} name={`isHoliday-${dayIndex}`}  label="稼働対象外" className='m-1' onChange={(e) => onDayUpdate(e, day)} />
            </Form>
          </td>
        )
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

type SummaryProps = {
  days: Array<DayData>;
  standardTime: number;
}

const Summary: React.FC<SummaryProps> = ({ days, standardTime }) => {
  const daysWithoutHoliday =  days.filter(day => !day.isHoliday);
  const totalScheduled = Number(daysWithoutHoliday.reduce((sum, day) => sum + day.scheduled, 0).toFixed(1));
  const diffScheduled = Number((totalScheduled - standardTime).toFixed(1));
  const totalScheduledClassName = (totalScheduled >= standardTime) ? 'text-white bg-success' : 'text-white bg-danger';
  const totalActual = daysWithoutHoliday.reduce((sum, day) => sum + day.actual, 0);
  const diffActual = totalActual - standardTime;
  const totalActualClassName = (totalActual >= standardTime) ? 'text-white bg-success' : 'text-white bg-danger';

  return(
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
          <td>{standardTime}時間</td>
          <td className={totalScheduledClassName}>{totalScheduled}時間</td>
          <td className={totalScheduledClassName}>{diffScheduled}時間</td>
          <td className={totalActualClassName}>{totalActual}時間</td>
          <td className={totalActualClassName}>{diffActual}時間</td>
        </tr>
      </tbody>
    </Table>
  )
};


const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if(router.isReady) { setDisplay(true); }
  }, [router.isReady]);

  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const date = CalendarDate(year, month, 1);
  const monthKey = date.monthlyKey();

  const saveQueryParam = (jsonObject: ParameterType): string => {
    const jsonQuery = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
    const monthPath = PathGenerator().monthPath(date.year(), date.month(), jsonQuery)
    router.push(monthPath);
    return monthPath;
  }

  if(jsonObject.week == undefined) {
    return(
      display && <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  if(typeof jsonObject.months === 'string') {
    jsonObject.months = undefined;
    saveQueryParam(jsonObject);
  }

  const onDayUpdate = (e: React.ChangeEvent<HTMLInputElement>, day: DayData): void => {
    const attributeName = e.target.name.split('-')[0];
    const dayIndex = e.target.name.split('-')[1];
    if(e.target.type === 'checkbox') {
      days[dayIndex][attributeName] = e.target.checked;
    } else {
      days[dayIndex][attributeName] = Number(e.target.value)
    }
    saveQueryParam(jsonObject);
    console.log('the day has been updated') // トーストで表示したい
  }

  const initializeDays = (): void => {
    jsonObject.months[monthKey] = DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week);
    saveQueryParam(jsonObject);
    console.log('days has been initialized') // トーストで表示したい
  }

  const recalculateDays = (days: Array<DayData>): void => {
    jsonObject.months[monthKey] = DaysGenerator.executeWithDays(Number(year), Number(month), jsonObject.standardTime, jsonObject.week, days);
    saveQueryParam(jsonObject);
    console.log('days has been recalculated') // トーストで表示したい
  }

  if(jsonObject.months == undefined) { jsonObject.months = {} as MonthTable; }

  if(jsonObject.months[monthKey] == undefined && Object.entries(jsonObject.months).length == 0) {
    jsonObject.months[monthKey] = DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week);
    saveQueryParam(jsonObject);
    return;
  } else if(jsonObject.months[monthKey] == undefined && Object.entries(jsonObject.months).length > 0) {
    // NOTE: 二つ月分のクエリパラメータを保持するとnextjsが500を返してしまう。文字数がデカすぎる可能性があるので、一つの月分のみ保持するようにする。
    const result = confirm('他の月データが存在します。他の月のデータを削除しますが、操作を続けますか？')
    if(result) {
      jsonObject.months = {} as MonthTable;
      jsonObject.months[monthKey] = DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week);
      saveQueryParam(jsonObject);
      return
    } else {
      const jsonQuery = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
      document.location = PathGenerator().rootPath(jsonQuery);
      return;
    }
  }

  const days = jsonObject.months[monthKey]

  return (
    <>
      {jsonObject.name && <h1>{jsonObject.name}の{year}年{month}月</h1>}
      {!jsonObject.name && <h1>{year}年{month}月</h1>}
      <Month workingWeek={jsonObject.week} year={Number(year)} month={Number(month)} days={days} onDayUpdate={onDayUpdate} />
      <Summary days={days} standardTime={jsonObject.standardTime} />

      <Col>
        <Button variant="secondary" onClick={initializeDays}>時間を初期状態にする</Button>
      </Col>
      <Col>
        <Button variant="primary" onClick={(() => recalculateDays(days)) }>未稼働日の予定を再計算する</Button>
      </Col>
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

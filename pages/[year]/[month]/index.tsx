import { DaysGenerator, DayObject } from '../../../lib/days_generator';
import { JsonParameter } from '../../../lib/json_parameter';
import Layout from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { WeekData, MonthTable, ParameterType } from '../../../types/calendar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PathGenerator } from '../../../lib/path_generator';
import { useToast } from '../../../hooks/useToast';
import { ToastComponent } from '../../../components/toast';
import { MonthSummary } from '../../../components/month_summary';

type MonthProps = {
  workingWeek: WeekData;
  year: number;
  month: number;
  days: Array<DayObject>;
  onDayUpdate: (e: any, day: DayObject) => void;
}

const Month: React.FC<MonthProps>= ({ workingWeek, year, month, days, onDayUpdate }) => {
  const date = CalendarDate(year, month, 1);
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarRows = [];
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  let dayCount = 1;

  const renderTextFields = (day: DayObject, dayIndex: number) => {
    return(
      <>
        <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
          <Form.Control type="text" value={day.scheduled} name={`scheduled-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="実績" >
          <Form.Control type="text" value={day.actual} name={`actual-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
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
        if(Number(day.actual)) { tdClassName = 'bg-success text-light' }
        if(day.isHoliday) { tdClassName = 'bg-secondary text-light' }

        const row = (
          <td key={j} className={tdClassName}>
            {dayNo}日{CalendarDate(year, month, dayNo).isNationalHoliday() && '(祝)'}<br />

            <Form>
              <Form.Check type="switch" checked={!!day.isHoliday} name={`isHoliday-${dayIndex}`}  label="稼働対象外" className='m-1' onChange={(e) => onDayUpdate(e, day)} />
              {!day.isHoliday && renderTextFields(day, dayIndex)}
            </Form>
          </td>
        )
        week.push(row)
      }
    }

    calendarRows.push(<tr key={i}>{week}</tr>);
  }

  return (
    <>
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
    </>
  );
};

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const [display, setDisplay] = useState(false);
  const toastProps = useToast();

  useEffect(() => {
    if(router.isReady) { setDisplay(true); }
  }, [router.isReady]);

  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const date = CalendarDate(year, month, 1);
  const monthKey = date.monthlyKey();

  const saveQueryParam = (jsonObject: ParameterType): string => {
    const jsonQuery = JsonParameter.serialize({ name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months })
    const monthPath = PathGenerator().monthPath(date.year(), date.month(), jsonQuery)
    router.push(monthPath, undefined, { scroll: false });
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

  const onDayUpdate = (e: React.ChangeEvent<HTMLInputElement>, day: DayObject): void => {
    e.preventDefault();
    const attributeName = e.target.name.split('-')[0];
    const dayIndex = e.target.name.split('-')[1];
    if(e.target.type === 'checkbox') {
      days[dayIndex][attributeName] = e.target.checked;
    } else {
      days[dayIndex][attributeName] = e.target.value
    }
    jsonObject.months[monthKey] = days
    saveQueryParam(jsonObject);
    toastProps.notify('時間を更新しました')
  }

  const initializeDays = (e): void => {
    e.preventDefault();
    jsonObject.months[monthKey] = DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week);
    saveQueryParam(jsonObject);
    toastProps.notify('初期化しました')
  }

  const recalculateDays = (e, days: Array<DayObject>): void => {
    e.preventDefault();
    jsonObject.months[monthKey] = DaysGenerator.executeWithDays(Number(year), Number(month), jsonObject.standardTime, jsonObject.week, days);
    saveQueryParam(jsonObject);
    toastProps.notify('再計算しました')
  }

  if(jsonObject.months == undefined) { jsonObject.months = {} as MonthTable; }

  if(display && jsonObject.months[monthKey] == undefined && Object.entries(jsonObject.months).length == 0) {
    jsonObject.months[monthKey] = DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week);
    saveQueryParam(jsonObject);
    return;
  } else if(display && jsonObject.months[monthKey] == undefined && Object.entries(jsonObject.months).length > 0) {
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

  let days = []
  if(display) {
    // NOTE: jsonObjectを作ったばかりだとjsonObject.months[monthKey]がObjectなので、DayObjectで埋め直す
    days = jsonObject.months[monthKey].map((day: DayObject, index: number) => {
      return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday))
    })
  }

  return (
    <>
      {jsonObject.name && <h1>{jsonObject.name}の{year}年{month}月</h1>}
      {!jsonObject.name && <h1>{year}年{month}月</h1>}
      {display && <Month workingWeek={jsonObject.week} year={Number(year)} month={Number(month)} days={days} onDayUpdate={onDayUpdate} />}
      {display && <MonthSummary days={days} standardTime={jsonObject.standardTime} />}

      <Col>
        <Button type='button' variant="secondary" onClick={initializeDays}>時間を初期状態にする</Button>
      </Col>
      <Col>
        <Button type='button' variant="primary" onClick={((e) => recalculateDays(e, days)) }>未稼働日の予定を再計算する</Button>
      </Col>

      <ToastComponent {...toastProps} />
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

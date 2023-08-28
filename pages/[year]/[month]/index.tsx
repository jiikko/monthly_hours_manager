import { DaysGenerator, DayObject } from '../../../lib/days_generator';
import { JsonParameter, JsonParameterTypeImpl, Week } from '../../../lib/json_parameter';
import Layout from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Table, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState, useReducer } from 'react';
import { PathGenerator } from '../../../lib/path_generator';
import { useToast } from '../../../hooks/useToast';
import { ToastComponent } from '../../../components/toast';
import { MonthSummary } from '../../../components/month_summary';
import { CalendarReducer } from '../../../reducers/calendar_reducer';

type MonthProps = {
  year: number;
  month: number;
  days: Array<DayObject>;
  workingWeek: Week;
  handleUpdateDay: (attributeName: string, value: boolean | string, dayIndex: number) => void;
}

const Month: React.FC<MonthProps>= ({ year, month, days, workingWeek, handleUpdateDay }) => {
  const date = CalendarDate(year, month, 1);
  const firstDayOfMonth = date.firstWeekDayOfMonth(); // 当月の最初の曜日を取得
  const daysInMonth = date.lastDayOfMonth(); // 当月の最終日の日付を取得
  const calendarRows = [];

  let dayCount = 1;

  for (let i = 0; i < 6; i++) { // 最大6週間
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
        week.push(<td key={j}></td>);
      } else {
        const dayNo = dayCount++; // 1から始まる
        const dayIndex = dayNo - 1;
        const day = days[dayIndex];
        const calendarDate = CalendarDate(year, month, dayNo);

        let tdClassName = (workingWeek[calendarDate.weekDayName()]) ? 'bg-info' : 'bg-secondary text-light';
        if(Number(day.actual)) { tdClassName = 'bg-success text-light' }
        if(day.isHoliday) { tdClassName = 'bg-secondary text-light' }
        if(day.isInvalid()) { tdClassName = 'bg-warning text-light' }

        const row = (
          <td key={j} className={tdClassName}>
            {dayNo}日{calendarDate.isNationalHoliday() && '(祝)'}<br />

            <Form>
              <Form.Check type="switch" checked={day.isHoliday} name={'isHoliday'}  label="稼働対象外" className='m-1' onChange={(e) => handleUpdateDay('isHoliday', e.target.checked, dayIndex)} />
              {day.isWorkingDay() && (
                <>
                  <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
                    <Form.Control type="text" value={day.scheduled} name={'scheduled'} onChange={(e) => handleUpdateDay('scheduled', e.target.value, dayIndex)} />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingInput" label="実績" >
                    <Form.Control type="text" value={day.actual} name={'actual'} onChange={(e) => handleUpdateDay('actual', e.target.value, dayIndex)} />
                  </FloatingLabel>
                </>
              )}
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
  const date = CalendarDate(year && Number(year), month && Number(month), 1);
  const monthKey = date.monthlyKey();
  const toastProps = useToast();

  const [calendarState, dispatch] = useReducer(
    CalendarReducer, { name: '', standardTime: 0, week: {}, months: {} }
  );
  const calendarName = calendarState.name;
  const calendarStandardTime = calendarState.standardTime;
  const calendarWeek = calendarState.week;
  const calendarMonths = calendarState.months;
  console.log('foo')

  useEffect(() => {
    if (router.isReady) {
      setDisplay(true)

      const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
      dispatch({
        type: 'initialize',
        payload: { name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months }
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    if(display) {
      const json = new JsonParameterTypeImpl(calendarState.name, calendarState.standardTime, calendarState.week, calendarState.months);
      const monthPath = PathGenerator().monthPath(date.year(), date.month(), json.serializeAsJson())
      router.push(monthPath , undefined, { scroll: false });
    }
  }, [display, calendarState]);

  if(calendarStandardTime === undefined) {
    return(
      display && <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  const handleUpdateDay = (attributeName: string, value: boolean | string, dayIndex: number): void => {
    days[dayIndex][attributeName] = value
    dispatch({ type: 'updateDays', payload: { monthKey: monthKey, days: days } });
    toastProps.notify('時間を更新しました')
  }

  const handleInitializeDaysButton = (): void => {
    const result = confirm('現在入力済みの時間をすべて削除しますが、操作を続けますか？');
    if(result) { initializeDays(true); }
  }

  const handleRecalculateDaysButton = (days: Array<DayObject>): void => {
    const result = confirm('実績が入力されていない時間をすべて削除しますが、操作を続けますか？');
    if(result) { recalculateDays(days); }
  }

  const initializeDays = (notify?: boolean): void => {
    const initializedDays = DaysGenerator.execute(Number(year), Number(month), calendarStandardTime, calendarWeek)
    dispatch({ type: 'updateDays', payload: { monthKey: monthKey, days: initializedDays } });
    if(notify) { toastProps.notify('初期化しました') }
  }

  const recalculateDays = (days: Array<DayObject>): void => {
    const recalculatedDays = DaysGenerator.executeWithDays(Number(year), Number(month), calendarStandardTime, calendarWeek, days)
    dispatch({ type: 'updateDays', payload: { monthKey: monthKey, days: recalculatedDays } });
    toastProps.notify('再計算しました')
  }

  console.log(display, calendarMonths, Object.entries(calendarMonths).length, (calendarMonths.months && calendarMonths[monthKey]))
  if(display && calendarMonths && Object.entries(calendarMonths).length == 0 && calendarMonths[monthKey] === undefined) {
    initializeDays();
    console.log('初期化しました')
  } else if(display && calendarMonths && Object.entries(calendarMonths).length > 0 && calendarMonths[monthKey] === undefined) {
    console.log('!!!!!!!!!!!!')
    // NOTE: 2つ月分のクエリパラメータを保持するとnextjsが500を返してしまう。パラメータがデカすぎる可能性があるので、1つの月分のみ保持するようにする。
    const result = confirm('他の月データが存在します。他の月のデータを削除しますが、操作を続けますか？')
    if(result) {
      dispatch({ type: 'clearMonths', payload: {} });
      initializeDays();
      console.log('初期化しました2')
      return
    } else {
      const json = new JsonParameterTypeImpl(calendarState.name, calendarState.standardTime, calendarState.week, calendarMonths);
      document.location = PathGenerator().rootPath(json.serializeAsJson());
      console.log('トップページに戻ります')
      return;
    }
  }

  let days = []
  if(calendarMonths[monthKey]) {
    days = calendarMonths[monthKey].map((day: DayObject, _: number) => { return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday)) })
  }

  return (
    <>
      {calendarName ? <h1>{calendarName}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
      {days.length && <Month year={Number(year)} month={Number(month)} days={days} workingWeek={calendarWeek} handleUpdateDay={handleUpdateDay} />}
      {<MonthSummary days={days} standardTime={calendarStandardTime} />}

      <Col>
        <Button type='button' variant="secondary" onClick={handleInitializeDaysButton}>時間を初期状態にする</Button>
      </Col>
      <Col>
        <Button type='button' variant="primary" onClick={((_) => handleRecalculateDaysButton(days)) }>未稼働日の予定を再計算する</Button>
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

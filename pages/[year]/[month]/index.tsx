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
  year: number;
  month: number;
  days: Array<DayObject>;
  workingWeek: WeekData;
  onDayUpdate: (e: any, day: DayObject) => void;
}

const Month: React.FC<MonthProps>= ({ year, month, days, workingWeek, onDayUpdate }) => {
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
              <Form.Check type="switch" checked={day.isHoliday} name={`isHoliday-${dayIndex}`}  label="稼働対象外" className='m-1' onChange={(e) => onDayUpdate(e, day)} />
              {day.isWorkingDay() && (
                <>
                  <FloatingLabel controlId="floatingInput" label="予定" className='mb-2' >
                    <Form.Control type="text" value={day.scheduled} name={`scheduled-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingInput" label="実績" >
                    <Form.Control type="text" value={day.actual} name={`actual-${dayIndex}`} onChange={(e) => onDayUpdate(e, day)} />
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
  const toastProps = useToast();

  useEffect(() => {
    if(router.isReady) { setDisplay(true); }
  }, [router.isReady]);

  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const date = CalendarDate(year, month, 1);
  const monthKey = date.monthlyKey();
  jsonObject.selectMonth(monthKey);

  const saveQueryParam = (jsonObject): string => {
    const monthPath = PathGenerator().monthPath(date.year(), date.month(), jsonObject.serializeAsJson())
    router.push(monthPath, undefined, { scroll: false });
    return monthPath;
  }

  if(jsonObject.hasNoSetting()) {
    return(
      display && <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  const onDayUpdate = (e: React.ChangeEvent<HTMLInputElement>, day: DayObject): void => {
    const attributeName = e.target.name.split('-')[0];
    const dayIndex = e.target.name.split('-')[1];
    if(e.target.type === 'checkbox') {
      days[dayIndex][attributeName] = e.target.checked;
    } else {
      days[dayIndex][attributeName] = e.target.value
    }
    jsonObject.setDaysInMonth(days)
    saveQueryParam(jsonObject);
    toastProps.notify('時間を更新しました')
  }

  const initializeDays = (notify?: boolean): void => {
    jsonObject.clearMonths();
    jsonObject.setDaysInMonth(DaysGenerator.execute(Number(year), Number(month), jsonObject.standardTime, jsonObject.week))
    saveQueryParam(jsonObject);
    if(notify) { toastProps.notify('初期化しました') }
  }

  const recalculateDays = (days: Array<DayObject>): void => {
    jsonObject.setDaysInMonth(DaysGenerator.executeWithDays(Number(year), Number(month), jsonObject.standardTime, jsonObject.week, days))
    saveQueryParam(jsonObject);
    toastProps.notify('再計算しました')
  }

  if(display && jsonObject.hasNoMothsSetting()) {
    initializeDays();
    return;
  } else if(display && jsonObject.isNoCurrentDaysInMonth() && jsonObject.hasMothsSetting()) {
    // NOTE: 二つ月分のクエリパラメータを保持するとnextjsが500を返してしまう。文字数がデカすぎる可能性があるので、一つの月分のみ保持するようにする。
    const result = confirm('他の月データが存在します。他の月のデータを削除しますが、操作を続けますか？')
    if(result) {
      initializeDays();
      return
    } else {
      document.location = PathGenerator().rootPath(jsonObject.serializeAsJson());
      return;
    }
  }

  let days = []
  if(display) { days = jsonObject.currentDaysInMonth() }

  return (
    <>
      {jsonObject.hasName() ? <h1>{jsonObject.name}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
      {display && <Month year={Number(year)} month={Number(month)} days={days} workingWeek={jsonObject.week} onDayUpdate={onDayUpdate} />}
      {<MonthSummary days={days} standardTime={jsonObject.standardTime} />}

      <Col>
        <Button type='button' variant="secondary" onClick={((e) => initializeDays(true))}>時間を初期状態にする</Button>
      </Col>
      <Col>
        <Button type='button' variant="primary" onClick={((e) => recalculateDays(days)) }>未稼働日の予定を再計算する</Button>
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

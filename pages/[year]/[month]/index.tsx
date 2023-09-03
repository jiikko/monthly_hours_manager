import { DaysGenerator, DayObject } from '../../../lib/days_generator';
import { Layout } from '../../../components/layout';
import type { NextPageWithLayout } from './../../_app'
import { CalendarDate } from '../../../lib/calendar_date';
import { Button, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PathGenerator } from '../../../lib/path_generator';
import { useToast } from '../../../hooks/useToast';
import { ToastComponent } from '../../../components/toast';
import { MonthSummary } from '../../../components/month_summary';
import { CalendarMonth } from '../../../components/calendar_month';
import { useCalendarState } from '../../../hooks/use_calendar_state';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const date = CalendarDate(year && Number(year), month && Number(month), 1);
  const monthKey = date.monthlyKey();
  const toastProps = useToast();
  const { calendarState, dispatch, calendar, loading, loaded } = useCalendarState(
    PathGenerator().monthPath, [date.year(), date.month()]
  );
  const handleUpdateDay = (attributeName: string, value: boolean | string, dayIndex: number): void => {
    days[dayIndex][attributeName] = value
    dispatch({
      type: 'updateDays',
      payload: { monthKey: monthKey, days: days.map((day: DayObject) => { return(day.toObject()) }) },
    })
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
    const initializedDays = DaysGenerator.execute(Number(year), Number(month), calendar.standardTime, calendar.week)
    dispatch({ type: 'updateDays', payload: { monthKey: monthKey, days: initializedDays } });
    if(notify) { toastProps.notify('初期化しました') }
  }
  const recalculateDays = (days: Array<DayObject>): void => {
    const recalculatedDays = DaysGenerator.executeWithDays(Number(year), Number(month), calendar.standardTime, calendar.week, days)
    dispatch({ type: 'updateDays', payload: { monthKey: monthKey, days: recalculatedDays } });
    toastProps.notify('再計算しました')
  }

  useEffect(() => {
    // NOTE: データの初期化
    if(loaded && calendar.hasSetting() && calendar.months && Object.entries(calendar.months).length == 0 && calendar.months[monthKey] === undefined) {
      initializeDays();
      console.log('初期化しました')
    } else if(loaded && calendar.hasSetting() && calendar.months && Object.entries(calendar.months).length > 0 && calendar.months[monthKey] === undefined) {
      // NOTE: 2つ月分のクエリパラメータを保持するとnextjsが500を返してしまう。パラメータがデカすぎる可能性があるので、1つの月分のみ保持するようにする。
      const result = confirm('他の月データが存在します。他の月のデータを削除しますが、操作を続けますか？')
      if(result) {
        dispatch({ type: 'clearMonths' });
        initializeDays();
        console.log('他の月を削除した上で初期化しました')
        return;
      } else {
        document.location = PathGenerator().rootPath(calendar.serializeAsJson());
        console.log('トップページに戻ります')
        return;
      }
    }
  }, [calendarState]);

  if(calendar.hasNoSetting()) {
    return(
      <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

  let days = []
  if(calendar.months[monthKey]) {
    days = calendar.months[monthKey].map((day: DayObject, _: number) => { return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday)) })
  }
  // NOTE: 画面遷移中にちらつかないようにするため
  if(loading || calendar.months[monthKey] === undefined) { return }

  return (
    <>
      {calendar.name ? <h1>{calendar.name}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
      {<CalendarMonth year={Number(year)} month={Number(month)} days={days} workingWeek={calendar.week} handleUpdateDay={handleUpdateDay} />}
      {<MonthSummary days={days} standardTime={calendar.standardTime} />}

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

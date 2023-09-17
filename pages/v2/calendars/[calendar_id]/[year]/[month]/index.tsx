import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from 'contexts/auth_context'
import { CalendarDate } from 'lib/calendar_date';
import { CalendarMonth } from 'components/calendar_month';
import { useRouter } from 'next/router';
import { DayObject } from 'lib/days_generator';
import { MonthSummary } from 'components/month_summary';
import { DaysGenerator } from 'lib/days_generator';
import { toast } from 'react-toastify';
import { useManageCalendar } from 'hooks/use_manage_calendar';
import { Button, Col } from 'react-bootstrap';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const calendar_id = typeof router.query.calendar_id === 'string' ? router.query.calendar_id : null;
  const { user } = useContext(AuthContext);
  const date = CalendarDate(year && Number(year), month && Number(month), 1);
  const monthKey = date.monthlyKey();
  const { fetchSingleCalendar, calendar, updateMonths } = useManageCalendar();

  const handleInitializeDaysButton = () => {
    const result = confirm('現在入力済みの時間をすべて削除しますが、操作を続けますか？');
    if(result) { initializeDays(); }
  }
  const handleRecalculateDaysButton = (days: Array<DayObject>) => {
    const result = confirm('実績が入力されていない時間をすべて削除しますが、操作を続けますか？');
    if(result) { recalculateDays(days); }
  }
  const recalculateDays = (days: Array<DayObject>): void => {
    calendar.months[monthKey] = DaysGenerator.executeWithDays(Number(year), Number(month), calendar.standardTime, calendar.week, days)
    updateMonths(user, calendar_id, monthKey);
    toast('再計算しました')
  }
  const handleUpdateDay = async (attributeName: string, value: boolean | string, dayIndex: number): Promise<void> => {
    days[dayIndex][attributeName] = value;
    calendar.months[monthKey] = days.map((day: DayObject) => { return(day.toObject()) });
    updateMonths(user, calendar_id, monthKey);
    toast('時間を更新しました');
  }
  const initializeDays = async (): Promise<void> => {  // asyncとPromise<void>を追加
    const days = DaysGenerator.execute(Number(year), Number(month), calendar.standardTime, calendar.week);
    if(calendar.months === undefined) { calendar.months = {} }
    calendar.months[monthKey] = days;
    updateMonths(user, calendar_id, monthKey);
    toast('初期化しました');
  };

  useEffect(() => {
    fetchSingleCalendar(user, calendar_id, monthKey)
  }, [])

  useEffect(() => {
    if(!calendar) { return }

    const initializeCalendar = () => {
      if(calendar.hasSetting() && ((calendar.months && calendar.months[monthKey] === undefined) || calendar.months === undefined)) {
        initializeDays();
      }
    }
    initializeCalendar();
  }, [calendar]);

  if(calendar === undefined) { return null }
  if(calendar === null) { return(<div className="alert alert-danger" role="alert">カレンダーが見つかりませんでした。</div>) }
  if(calendar.months && calendar.months[monthKey] === undefined) { return }
  if(calendar.hasNoSetting()) { return(<div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>) }

  let days = []
  if(calendar.months && calendar.months[monthKey]) {
    days = calendar.months[monthKey].map((day: DayObject, _: number) => { return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday)) })
  } else {
    return null
  }

  return(
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
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

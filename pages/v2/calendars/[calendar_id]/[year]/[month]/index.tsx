import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { useEffect, useContext } from 'react';
import { CalendarDate } from 'lib/calendar_date';
import { CalendarMonth } from 'components/calendar_month';
import { useRouter } from 'next/router';
import { DayObject } from 'lib/days_generator';
import { MonthSummary } from 'components/month_summary';
import { DaysGenerator } from 'lib/days_generator';
import { toast } from 'react-toastify';
import { useManageCalendar } from 'hooks/use_manage_calendar';
import { Button, Col, Row } from 'react-bootstrap';
import { RequiredCalendar } from 'layouts/required_calendar';
import { CalendarContext } from 'contexts/calendar_context';
import { useCurrentUser } from 'hooks/use_current_user';
import Link from 'next/link';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { calendar, calendar_id } = useContext(CalendarContext);
  const { user } = useCurrentUser()
  const date = CalendarDate(year && Number(year), month && Number(month), 1);
  const monthKey = date.monthlyKey();
  const { updateMonths } = useManageCalendar();

  const handleConfirm = (message: string, action: () => void) => {
    const result = confirm(message);
    if(result) { action(); }
  }

  const handleInitializeDaysButton = () => {
    handleConfirm('現在入力済みの時間をすべて削除しますが、操作を続けますか？', initializeDays);
  }
  const handleRecalculateDaysButton = (days: Array<DayObject>) => {
    handleConfirm('実績が入力されていない時間をすべて削除しますが、操作を続けますか？', () => { recalculateDays(days) });
  }
  const recalculateDays = (days: Array<DayObject>): void => {
    calendar.months[monthKey] = DaysGenerator.executeWithDays(Number(year), Number(month), calendar.standardTime, calendar.week, days)
    updateMonths(calendar, user, calendar_id, monthKey);
    toast('再計算しました')
  }
  const handleUpdateDay = async (attributeName: string, value: boolean | string, dayIndex: number): Promise<void> => {
    days[dayIndex][attributeName] = value;
    calendar.months[monthKey] = days.map((day: DayObject) => { return(day.toObject()) });
    updateMonths(calendar, user, calendar_id, monthKey);
    toast('時間を更新しました');
  }
  const initializeDays = async (): Promise<void> => {  // asyncとPromise<void>を追加
    const days = DaysGenerator.execute(Number(year), Number(month), calendar.standardTime, calendar.week);
    if(calendar.months === undefined) { calendar.months = {} }
    calendar.months[monthKey] = days;
    updateMonths(calendar, user, calendar_id, monthKey);
    toast('初期化しました');
  };

  useEffect(() => {
    const initializeCalendar = () => {
      if(((calendar.months && calendar.months[monthKey] === undefined) || calendar.months === undefined)) {
        initializeDays();
      }
    }
    initializeCalendar();
  }, []);

  let days = []
  if(calendar.months && calendar.months[monthKey]) {
    days = calendar.months[monthKey].map((day: DayObject, _: number) => { return(new DayObject(day.scheduled, day.actual, day.day, day.isHoliday)) })
  } else {
    return null
  }

  return(
    <>
      <Row className='mb-3'>
        <Col>
          {calendar.name ? <h1>{calendar.name}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
        </Col>

        <Col className="text-end mt-3">
          <Link href={`/v2/calendars/${calendar.id}/edit`}>
            <Button>カレンダーの編集</Button>
          </Link>
        </Col>
      </Row>

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
    <Layout>
      <RequiredCalendar>
        {page}
      </RequiredCalendar>
    </Layout>
  )
}

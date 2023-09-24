import {CalendarMonth} from 'components/calendar_month';
import {MonthSummary} from 'components/month_summary';
import {CalendarContext} from 'contexts/calendar_context';
import {useCurrentUser} from 'hooks/use_current_user';
import {useManageCalendar} from 'hooks/use_manage_calendar';
import {RequiredCalendar} from 'layouts/required_calendar';
import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import {CalendarDate} from 'lib/calendar_date';
import {DayObject, DaysGenerator} from 'lib/days_generator';
import Link from 'next/link';
import {useRouter} from 'next/router';
import type {NextPageWithLayout} from 'pages/_app';
import {useContext, useEffect} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';

type CalendarMonthData = {
  name: string;
  days: Array<DayObject>;
}

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { calendar } = useContext(CalendarContext);
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
    updateMonths(calendar, user, monthKey);
    toast('再計算しました')
  }
  const handleUpdateDay = async (attributeName: string, value: boolean | string, dayIndex: number): Promise<void> => {
    days[dayIndex][attributeName] = value;
    calendar.months[monthKey] = days.map((day: DayObject) => { return(day.toObject()) });
    updateMonths(calendar, user, monthKey);
    toast('時間を更新しました');
  }
  const initializeDays = async (): Promise<void> => {  // asyncとPromise<void>を追加
    const days = DaysGenerator.execute(Number(year), Number(month), calendar.standardTime, calendar.week);
    if(calendar.months === undefined) { calendar.months = {} }
    calendar.months[monthKey] = days;
    updateMonths(calendar, user, monthKey);
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
  const monthDataList = [{ name: null, days: days }] as Array<CalendarMonthData>;

  return(
    <>
      <Row className='mb-3'>
        <Col>
          {calendar.name ? <h1>{calendar.name}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
        </Col>

        <Col className="text-end mt-3">
          <Link href={`/v2/calendars/${calendar.id}/months`}>
            <Button>管理中の月一覧</Button>
          </Link>
        </Col>

        <Col className="text-end mt-3">
          <Link href={`/v2/calendars/${calendar.id}/edit`}>
            <Button>カレンダーの編集</Button>
          </Link>
        </Col>
      </Row>

      {<CalendarMonth year={Number(year)} month={Number(month)} monthDataList={monthDataList} days={days} workingWeek={calendar.week} handleUpdateDay={handleUpdateDay} />}
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
      <RequiredUser>
        <RequiredCalendar>
          {page}
        </RequiredCalendar>
      </RequiredUser>
    </Layout>
  )
}

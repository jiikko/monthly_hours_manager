import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from 'contexts/auth_context'
import { db } from "lib/firebase";
import { getDoc, doc, updateDoc, runTransaction, collection, query } from 'firebase/firestore';
import { Calendar } from 'lib/calendar';
import { CalendarDate } from 'lib/calendar_date';
import Link from 'next/link';
import { CalendarMonth } from 'components/calendar_month';
import { useRouter } from 'next/router';
import { DayObject } from 'lib/days_generator';
import { MonthSummary } from 'components/month_summary';
import { DaysGenerator } from 'lib/days_generator';
import { toast } from 'react-toastify';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const calendar_id = typeof router.query.calendar_id === 'string' ? router.query.calendar_id : null;
  const { user } = useContext(AuthContext);
  const entryPath = user && `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
  const [calendar, setCalendar] = useState<Calendar>(null);
  const [_, setCalendarMonth] = useState(null); // NOTE: calendar.monthsを更新した時に再レンダリングしてくれないので対策のstate. useReducerに変更すれば不要
  const date = CalendarDate(year && Number(year), month && Number(month), 1);
  const monthKey = date.monthlyKey();

  const updateCalendar = (calendar: Calendar) => {
    setCalendar(calendar)
    if(calendar.months) {
      setCalendarMonth(calendar.months[monthKey])
    }
  }

  const fetchCalendar = async () => {
    const docRef = doc(db, entryPath);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const doc = docSnap.data()
      const calendar = new Calendar(doc.name, doc.standardTime, doc.week, doc.months, false, docSnap.id)
      updateCalendar(calendar)
    } else {
      // TODO: 404処理
      console.log("No such document!");
    }
  }

  const handleUpdateDay = async (attributeName: string, value: boolean | string, dayIndex: number): Promise<void> => {
    days[dayIndex][attributeName] = value;
    calendar.months[monthKey] = days.map((day: DayObject) => { return(day.toObject()) });
    const docRef = doc(db, entryPath);
    updateDoc(docRef, { months: calendar.months });
    updateCalendar(calendar);
    toast('時間を更新しました');
  }

  const initializeDays = async (): Promise<void> => {  // asyncとPromise<void>を追加
    const days = DaysGenerator.execute(Number(year), Number(month), calendar.standardTime, calendar.week);
    if(calendar.months === undefined) { calendar.months = {} }
    calendar.months[monthKey] = days;
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, { months: calendar.months });
    updateCalendar(calendar)
    toast('初期化しました');
  };

  useEffect(() => {
    if(user) { fetchCalendar() }
  }, [user])

  useEffect(() => {
    if(!user) { return }
    if(!calendar) { return }

    const initializeCalendar = () => {
      if(calendar.hasSetting() && ((calendar.months && calendar.months[monthKey] === undefined) || calendar.months === undefined)) {
        initializeDays();
      }
    }

    initializeCalendar();
  }, [user, calendar]);

  if(!user) { return null }
  if(!calendar) { return null }
  if(calendar.months && calendar.months[monthKey] === undefined) { return }
  if(calendar.hasNoSetting()) {
    return(
      <div className="alert alert-danger" role="alert">カレンダーの設定情報がありません。設定してください。</div>
    )
  }

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
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

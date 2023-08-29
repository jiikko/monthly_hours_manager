import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { useRouter } from 'next/router';
import { JsonParameter, Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';
import { useReducer, useEffect } from 'react';
import { CalendarReducer } from '../reducers/calendar_reducer';
import { Calendar } from '../lib/calendar';

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const calendarName = jsonObject.name;
  const calendarStandardTime = jsonObject.standardTime;
  const calendarWeek = jsonObject.week;
  const calendarMonths = jsonObject.months;
  const calendar = new Calendar(calendarName, calendarStandardTime, calendarWeek, calendarMonths);

  const [calendarState, dispatch] = useReducer(
    CalendarReducer,
    { name: calendar.name, standardTime: calendar.standardTime, week: calendar.week, months: calendar.months }
  );

  const handleSubmit = (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  };

  useEffect(() => {
    if(router.isReady && calendarState.standardTime) {
      const editPath = PathGenerator().editPath(calendar.serializeAsJson());
      router.push(editPath , undefined, { scroll: false });
    }
  }, [calendarState]);

  return (
    <SettingForm calendar={calendar} handleSubmit={handleSubmit} />
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

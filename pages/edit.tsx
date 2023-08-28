import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { useRouter } from 'next/router';
import { JsonParameter, JsonParameterTypeImpl, Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';
import { useReducer, useEffect } from 'react';
import { CalendarReducer } from '../reducers/calendar_reducer';

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const calendarName = jsonObject.name;
  const calendarStandardTime = jsonObject.standardTime;
  const calendarWeek = jsonObject.week;
  const calendarMonths = jsonObject.months;

  const [calendarState, dispatch] = useReducer(
    CalendarReducer,
    { name: calendarName, standardTime: calendarStandardTime, week: calendarWeek, months: calendarMonths }
  );

  const handleSubmit = (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  };

  useEffect(() => {
    console.log('router.isReady:', router.isReady)

    if(router.isReady && calendarState.standardTime) {
      const json = new JsonParameterTypeImpl(calendarState.name, calendarState.standardTime, calendarState.week, calendarMonths);
      console.log('json:', json)
      const editPath = PathGenerator().editPath(json.serializeAsJson());
      router.push(editPath , undefined, { scroll: false });
    }
  }, [router.isReady, calendarState]);

  return (
    <SettingForm calendar={jsonObject} handleSubmit={handleSubmit} />
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

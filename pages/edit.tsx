import type { NextPageWithLayout } from './_app'
import { Layout } from '../components/layout'
import { useRouter } from 'next/router';
import { Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';
import { useEffect } from 'react';
import { useCalendarState } from '../hooks/use_calendar_state';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { calendarState, dispatch, calendar } = useCalendarState();
  const handleSubmit = (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  };
  // NOTE: stateからクエリパラメータに反映する
  useEffect(() => {
    if(router.isReady) {
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

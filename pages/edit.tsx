import type { NextPageWithLayout } from './_app'
import { Layout } from '../components/layout'
import { Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';
import { useCalendarState } from '../hooks/use_calendar_state';

const Page: NextPageWithLayout = () => {
  const { dispatch, calendar } = useCalendarState(PathGenerator().editPath);
  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  }

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

import {Week} from 'lib/calendar';
import {toast} from 'react-toastify';
import {SettingForm} from '../components/setting_form';
import {useCalendarState} from '../hooks/use_calendar_state';
import {Layout} from '../layouts/v1';
import {PathGenerator} from '../lib/path_generator';
import type {NextPageWithLayout} from './_app';

const Page: NextPageWithLayout = () => {
  const { dispatch, calendar } = useCalendarState(PathGenerator().editPath);
  const handleSubmit = async (name: string, standardTime: number, week: Week) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    toast('カレンダー情報の変更に成功しました。')
  }

  return (
    <>
      <h1>カレンダーの編集</h1>
      <SettingForm calendar={calendar} handleSubmit={handleSubmit} submitLabel={'保存する'} />
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { AuthContext} from '../../../contexts/auth_context'
import { useContext } from 'react';
import { Week, Calendar } from '../../../lib/calendar';
import { SettingForm } from '../../../components/setting_form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useManageCalendar } from 'hooks/use_manage_calendar';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const calendar = new Calendar(
    '新しいカレンダー',
    84,
    {} as Week,
    {}
  );
  const { createCalendar } = useManageCalendar();
  const handleSubmit = async (name: string, standardTime: number, week: Week) => {
    createCalendar(user, name, standardTime, week);
    toast("カレンダーを作成しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  return (
    <>
      <h1>カレンダーの新規登録</h1>
      <SettingForm calendar={calendar} handleSubmit={handleSubmit}  submitLabel={'新規作成する'} />
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

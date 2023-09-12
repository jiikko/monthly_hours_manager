import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';
import { Calendar } from '../../../lib/calendar';
import { SettingForm } from '../../../components/setting_form';

const Page: NextPageWithLayout = () => {
  const calendar = new Calendar('a', 11, {}, {});
  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
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

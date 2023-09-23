import {SettingForm} from 'components/setting_form';
import {CalendarContext} from 'contexts/calendar_context';
import {useCurrentUser} from 'hooks/use_current_user';
import {useManageCalendar} from 'hooks/use_manage_calendar';
import {RequiredCalendar} from 'layouts/required_calendar';
import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import {Week} from 'lib/calendar';
import {useRouter} from 'next/router';
import type {NextPageWithLayout} from 'pages/_app';
import {useContext} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useCurrentUser()
  const { calendar } = useContext(CalendarContext);
  const { updateCalendar, deleteCalendar } = useManageCalendar();

  const handleDelete = async () => {
    const result = confirm('削除しますか？')
    if(!result) { return }

    await deleteCalendar(user, calendar.id);
    toast("カレンダーを削除しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  const handleSubmit = async (name: string, standardTime: number, week: Week) => {
    await updateCalendar(user, calendar.id, name, standardTime, week);
    toast("カレンダーを更新しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  return (
    <>
      <h1>カレンダーの更新</h1>
      <Row className='mt-3'>
        <Col className="text-end">
          <Button variant="danger" onClick={handleDelete}>削除する</Button>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col className="text-end">
          作成日: {calendar.formattedCreatedAt()}
        </Col>
      </Row>
      {<SettingForm calendar={calendar} handleSubmit={handleSubmit}  submitLabel={'更新する'} />}
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

import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';
import { AuthContext} from 'contexts/auth_context'
import { CalendarContext } from 'contexts/calendar_context';
import { useContext } from 'react';
import { Week } from 'lib/calendar';
import { SettingForm } from 'components/setting_form';
import { db } from "lib/firebase";
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { RequiredCalendar } from 'layouts/required_calendar';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { calendar, calendar_id } = useContext(CalendarContext);

  const handleDelete = async () => {
    const result = confirm('削除しますか？')
    if(!result) { return }

    const entryPath = `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
    const docRef = doc(db, entryPath);
    await deleteDoc(docRef);
    toast("カレンダーを削除しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  const handleSubmit = async (name: string, standardTime: number, week: Week) => {
    const entryPath = `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, {
      name: name,
      standardTime: standardTime,
      week: week,
    });
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
      {<SettingForm calendar={calendar} handleSubmit={handleSubmit}  submitLabel={'更新する'} />}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredCalendar>
        {page}
      </RequiredCalendar>
    </Layout>
  )
}


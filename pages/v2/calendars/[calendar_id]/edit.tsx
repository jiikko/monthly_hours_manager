import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';
import { AuthContext} from 'contexts/auth_context'
import { useReducer, useEffect, useContext, useState } from 'react';
import { Week, Calendar } from 'lib/calendar';
import { SettingForm } from 'components/setting_form';
import { db } from "lib/firebase";
import { addDoc, runTransaction, updateDoc, collection, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const calendar_id = typeof router.query.calendar_id === 'string' ? router.query.calendar_id : null;
  const { user } = useContext(AuthContext);
  const [calendar, setCalendar] = useState<Calendar>(null);
  const entryPath = user && `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
  const handleDelete = async () => {
    const result = confirm('削除しますか？')
    if(!result) { return }

    const docRef = doc(db, entryPath);
    await deleteDoc(docRef);
    toast("カレンダーを削除しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  const handleSubmit = async (name: string, standardTime: number, week: Week) => {
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, {
      name: name,
      standardTime: standardTime,
      week: week,
      months: {}
    });
    toast("カレンダーを更新しました。");
    router.push(`/v2/calendars`, undefined,{ scroll: false })
  }

  useEffect(() => {
    const fetchCalendar = async (user, calendar_id: string) => {
      const docRef = doc(db, entryPath);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const doc = docSnap.data()
        const calendar = new Calendar(doc.name, doc.standardTime, doc.week, doc.months, false, docSnap.id)
        setCalendar(calendar)
      } else {
        // TODO: 404処理
        console.log("No such document!");
      }
    }

    if(user && calendar_id) { fetchCalendar(user, calendar_id) }
  }, [user, calendar_id])

  if(!user) { return null }
  if(calendar === undefined) { return null }

  return (
    <>
      <h1>カレンダーの更新</h1>
      <Row className='mt-3'>
        <Col className="text-end">
          <Button variant="danger" onClick={handleDelete}>削除する</Button>
        </Col>
      </Row>
      {calendar && <SettingForm calendar={calendar} handleSubmit={handleSubmit}  submitLabel={'更新する'} />}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}


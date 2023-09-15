import type { NextPageWithLayout } from './../../../_app'
import { Layout } from '../../../../layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';
import { AuthContext} from '../../../../contexts/auth_context'
import { useReducer, useEffect, useContext, useState } from 'react';
import { Week, Calendar } from '../../../../lib/calendar';
import { SettingForm } from '../../../../components/setting_form';
import { db } from "../../../../lib/firebase";
import { addDoc, runTransaction, updateDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { calendar_id } = router.query;
  const { user } = useContext(AuthContext);
  const [calendar, setCalendar] = useState<Calendar>(null);
  const entryPath = `time-manager-v2/${user.uid}/calendars/${calendar_id}`;

  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, {
      name: name,
      standardTime: standardTime,
      week: week,
      months: {}
    });
  }

  useEffect(() => {
    const fetchCalendar = async (user, calendar_id) => {
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


  return (
    <>
      <h1>カレンダーの更新</h1>
      {calendar && <SettingForm calendar={calendar} handleSubmit={handleSubmit}  submitLabel={'新規作成する'} />}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}


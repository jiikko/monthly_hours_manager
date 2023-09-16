import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { Button, Row, Col, Table, Nav } from 'react-bootstrap';
import { useReducer, useEffect, useContext, useState } from 'react';
import { AuthContext } from 'contexts/auth_context'
import { db } from "lib/firebase";
import { getDoc, doc, runTransaction, collection, query } from 'firebase/firestore';
import { Calendar } from 'lib/calendar';
import { CalendarDate } from 'lib/calendar_date';
import { PathGenerator } from 'lib/path_generator';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const calendar_id = typeof router.query.calendar_id === 'string' ? router.query.calendar_id : null;
  const { user } = useContext(AuthContext);
  const entryPath = user && `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
  const [calendar, setCalendar] = useState<Calendar>(null);

  useEffect(() => {
    const fetchCalendar = async (user) => {
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

    if(user) { fetchCalendar(user) }
  }, [user])

  if(!user) { return null }
  if(!calendar) { return null }

  return(
    <>
      {calendar.name ? <h1>{calendar.name}の{year}年{month}月</h1> : <h1>{year}年{month}月</h1>}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { Button, Row, Col } from 'react-bootstrap';
import { AuthContext} from '../../../contexts/auth_context'
import { useReducer, useEffect, useContext, useState } from 'react';
import { Week, Calendar } from '../../../lib/calendar';
import { SettingForm } from '../../../components/setting_form';
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Page: NextPageWithLayout = () => {
  const { user } = useContext(AuthContext);
  const calendar = new Calendar('a', 11, {} as Week, {});
  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
      const uid = user.uid;
      const docRef = doc(db, `time-manager-v2/${uid}`);
      setDoc(docRef, {
        name: calendar.name, standardTime: calendar.standardTime, week: calendar.week, months: (calendar.months || {})
      });
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

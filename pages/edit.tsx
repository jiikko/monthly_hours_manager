import type { NextPageWithLayout } from './_app'
import { Layout } from '../components/layout'
import { useRouter } from 'next/router';
import { Week } from '../lib/json_parameter';
import { PathGenerator } from '../lib/path_generator';
import { SettingForm } from '../components/setting_form';
import { useEffect, useContext } from 'react';
import { useCalendarState } from '../hooks/use_calendar_state';
import { db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { calendarState, dispatch, calendar, user } = useCalendarState();
  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  }

  // NOTE: 永続化処理
  useEffect(() => {
    if(user) {
      // NOTE: stateからDBに反映する
      if(user) {
        const uid = user.uid;
        const docRef = doc(db, `time-manager/${uid}`);
        setDoc(docRef, {
          name: calendar.name, standardTime: calendar.standardTime, week: calendar.week,
        }, { merge: true });
      }
    } else if(user === null) {
      // NOTE: stateからクエリパラメータに反映する
      const editPath = PathGenerator().editPath(calendar.serializeAsJson());
      router.push(editPath , undefined, { scroll: false });
    } else if(user === undefined) {
      // NOTE: ログイン状態の確認が完了していない場合は何もしない
    }
  }, [calendarState]);

  return (
    <>
      {<SettingForm calendar={calendar} handleSubmit={handleSubmit} />}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

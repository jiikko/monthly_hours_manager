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
import { AuthContext} from '../contexts/auth_context'

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, loaded } = useContext(AuthContext);
  const { calendarState, dispatch, calendar } = useCalendarState(user, loaded);
  const handleSubmit = async (name: string, standardTime: number, week: Week, notify: (message: string) => void) => {
    dispatch({ type:'updateCalendar', payload: { name, standardTime, week }});
    notify('カレンダー情報の変更に成功しました。')
  }
  console.log(loaded, user)

  // NOTE: 永続化処理
  useEffect(() => {
    if(!loaded) { return }

    if(user) {
      // NOTE: stateからDBに反映する
      if(user) {
        const uid = user.uid;
        const docRef = doc(db, `time-manager/${uid}`);
        setDoc(docRef, {
          name: calendar.name, standardTime: calendar.standardTime, week: calendar.week,
        }, { merge: true });
      }
    } else {
      // NOTE: stateからクエリパラメータに反映する
      const editPath = PathGenerator().editPath(calendar.serializeAsJson());
      router.push(editPath , undefined, { scroll: false });
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

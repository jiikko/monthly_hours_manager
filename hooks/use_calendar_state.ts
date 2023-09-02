import { useReducer, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { CalendarReducer } from '../reducers/calendar_reducer';
import { JsonParameter } from '../lib/json_parameter';
import { Calendar } from '../lib/calendar';
import { AuthContext} from '../contexts/auth_context'
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useCalendarState = (redirectPathFunc?: any) => {
  const router = useRouter();
  const { user, loaded } = useContext(AuthContext);
  const [calendarState, dispatch] = useReducer(
    CalendarReducer, { name: '', standardTime: 0, week: {}, months: {} }
  );
  const calendar = new Calendar(calendarState.name, calendarState.standardTime, calendarState.week, calendarState.months);

  // NOTE: 画面読み込み時に、ストレージからstateへ復元する
  useEffect(() => {
    if(user) {
      const docRef = doc(db, `time-manager/${user.uid}`);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          const doc = docSnap.data()
          dispatch({
            type: 'initialize',
            payload: { name: doc.name, standardTime: doc.standardTime, week: doc.week, months: doc.months }
          });
        } else {
          console.log("No such document!");
        }
      })
    } else if(user === null){
      if (router.isReady) {
        const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
        dispatch({
          type: 'initialize',
          payload: { name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months }
        });
      }
    } else if (user === undefined) {
      // NOTE: ログイン状態の確認が完了していない場合は何もしない
    }
  }, [router.isReady, loaded]);

  // NOTE: stateを変更した時に永続化処理をする
  useEffect(() => {
    if(user) {
      // NOTE: stateからDBに反映する
      if(user) {
        const uid = user.uid;
        const docRef = doc(db, `time-manager/${uid}`);
        setDoc(docRef, {
          name: calendar.name, standardTime: calendar.standardTime, week: calendar.week, months: (calendar.months || {})
        }, { merge: true });
      }
    } else if(user === null && redirectPathFunc) {
      // NOTE: stateからクエリパラメータに反映する
      const path = redirectPathFunc(calendar.serializeAsJson())
      router.push(path , undefined, { scroll: false });
    } else if(user === undefined) {
      // NOTE: ログイン状態の確認が完了していない場合は何もしない
    }
  }, [calendarState]);

  return { calendarState, dispatch, calendar, user };
}

import { useReducer, useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { CalendarReducer } from '../reducers/calendar_reducer';
import { JsonParameter } from '../lib/json_parameter';
import { Calendar, Week } from '../lib/calendar';
import { AuthContext} from '../contexts/auth_context'
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useCalendarState = (redirectPathFunc?: any, redirectPathFuncArgs?: Array<number | string>) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [calendarState, dispatch] = useReducer(
    CalendarReducer, { name: '', standardTime: 0, week: Week.create(), months: {} }
  );
  calendarState.week ||= Week.create();
  const calendar = new Calendar(calendarState.name, calendarState.standardTime, Week.parse(calendarState.week), calendarState.months, !!user);
  const loading = user === undefined
  const loaded = user !== undefined

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
    // NOTE: 空の状態でストレージを上書きしてしまわないようにする
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    if(user) {
      // NOTE: stateからDBに反映する
      const uid = user.uid;
      const docRef = doc(db, `time-manager/${uid}`);
      console.log('calendar.months:', calendar.months)

      setDoc(docRef, {
        name: calendar.name, standardTime: calendar.standardTime, week: calendar.week.toObject(), months: (calendar.months || {})
      });
    } else if(user === null && redirectPathFunc) {
      // NOTE: stateからクエリパラメータに反映する
      let path = '';
      if (Array.isArray(redirectPathFuncArgs)) {
        path = redirectPathFunc(...redirectPathFuncArgs, calendar.serializeAsJson())
      } else {
        path = redirectPathFunc(calendar.serializeAsJson())
      }
      router.push(path , undefined, { scroll: false });
    } else if(user === undefined) {
      // NOTE: ログイン状態の確認が完了していない場合は何もしない
    }
  }, [calendarState]);

  return { calendarState, dispatch, calendar, user, loading, loaded };
}

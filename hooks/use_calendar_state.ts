import { useReducer, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { CalendarReducer } from '../reducers/calendar_reducer';
import { JsonParameter } from '../lib/json_parameter';
import { Calendar } from '../lib/calendar';
import { AuthContext} from '../contexts/auth_context'

import { doc, getFirestore, getDoc } from 'firebase/firestore';

export const useCalendarState = (user: any, loaded: boolean) => {
  const router = useRouter();
  const [calendarState, dispatch] = useReducer(
    CalendarReducer, { name: '', standardTime: 0, week: {}, months: {} }
  );
  const calendar = new Calendar(calendarState.name, calendarState.standardTime, calendarState.week, calendarState.months);

  // NOTE: stateへ反映する
  useEffect(() => {
    if(!loaded) { return }

    if(user) {
      const db = getFirestore();
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
    } else {
      if (router.isReady) {
        const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
        dispatch({
          type: 'initialize',
          payload: { name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months }
        });
      }
    }
  }, [router.isReady, loaded, user]);

  return { calendarState, dispatch, calendar };
}

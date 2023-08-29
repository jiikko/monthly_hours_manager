import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CalendarReducer } from '../reducers/calendar_reducer';
import { JsonParameter } from '../lib/json_parameter';
import { Calendar } from '../lib/calendar';

export const useCalendarState = () => {
  const router = useRouter();
  const [calendarState, dispatch] = useReducer(
    CalendarReducer, { name: '', standardTime: 0, week: {}, months: {} }
  );
  const calendar = new Calendar(calendarState.name, calendarState.standardTime, calendarState.week, calendarState.months);

  // NOTE: クエリパラメータからstateへ反映する
  useEffect(() => {
    if (router.isReady) {
      const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
      dispatch({
        type: 'initialize',
        payload: { name: jsonObject.name, standardTime: jsonObject.standardTime, week: jsonObject.week, months: jsonObject.months }
      });
    }
  }, [router.isReady]);

  return { calendarState, dispatch, calendar };
}

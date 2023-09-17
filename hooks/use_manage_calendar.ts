import { useState, useEffect } from 'react';
import { Calendar } from 'lib/calendar';
import type { User } from '@firebase/auth'
import { db } from "lib/firebase";
import { getDoc, doc, updateDoc, runTransaction, collection, query } from 'firebase/firestore';

export const useManageCalendar = () => {
  const [calendar, setCalendar] = useState<Calendar>(undefined);
  // NOTE: calendar.monthsを更新した時に再レンダリングしてくれないので対策のためのstate. useReducerに変更すれば不要らしい
  const [_, setCalendarMonth] = useState(null);

  const updateCalendarForReRender = (calendar: Calendar, monthKey?: string) => {
    setCalendar(calendar)
    if(monthKey && calendar.months) { setCalendarMonth(calendar.months[monthKey]) }
  }

  const updateMonths = async (user: User, calendar_id: string, monthKey: string) => {
    const entryPath = `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, { months: calendar.months });
    updateCalendarForReRender(calendar, monthKey);
  }

  const fetchSingleCalendar = async (user: User, calendar_id: string, monthKey?: string) => {
    const entryPath = user && `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
    const docRef = doc(db, entryPath);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const doc = docSnap.data()
      const calendar = new Calendar(doc.name, doc.standardTime, doc.week, doc.months, false, docSnap.id)
      updateCalendarForReRender(calendar, monthKey);
    } else {
      setCalendar(null);
      console.log("No such document!");
    }
  };

  return { calendar, fetchSingleCalendar, updateMonths };
}

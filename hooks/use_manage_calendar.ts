import { useState } from 'react';
import { Calendar } from 'lib/calendar';
import type { User } from '@firebase/auth'
import { db } from "lib/firebase";
import { getDoc, doc, updateDoc, deleteDoc, collection, addDoc, query } from 'firebase/firestore';
import { Week } from '../lib/calendar';
import {debug} from 'console';

export const useManageCalendar = () => {
  const [calendar, setCalendar] = useState<Calendar>(undefined);
  // NOTE: calendar.monthsを更新した時に再レンダリングしてくれないので対策のためのstate. useReducerに変更すれば不要らしい
  const [_, setCalendarMonth] = useState(null);

  const updateCalendarForReRender = (calendar: Calendar, monthKey?: string) => {
    setCalendar(calendar)
    if(monthKey && calendar.months) { setCalendarMonth(calendar.months[monthKey]) }
  }

  const updateMonths = async (calendar: Calendar, user: User, calendar_id: string, monthKey: string) => {
    const entryPath = calendarPath(user, calendar_id);
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, { months: calendar.months });
    updateCalendarForReRender(calendar, monthKey);
  }

  const updateCalendar = async (user: User, calendar_id: string, name: string, standardTime: number, week: Week) => {
    const entryPath = calendarPath(user, calendar_id);
    const docRef = doc(db, entryPath);
    await updateDoc(docRef, {
      name: name,
      standardTime: standardTime,
      week: week,
    });
  }

  const deleteCalendar = async (user: User, calendar_id: string) => {
    const entryPath = calendarPath(user, calendar_id);
    const docRef = doc(db, entryPath);
    await deleteDoc(docRef);
  }

  const fetchSingleCalendar = async (user: User, calendar_id: string, monthKey?: string) => {
    const entryPath = calendarPath(user, calendar_id);
    const docRef = doc(db, entryPath);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const doc = docSnap.data()
      const calendar = new Calendar(doc.name, doc.standardTime, doc.week, doc.months, false, docSnap.id, doc.created_at.toDate())
      updateCalendarForReRender(calendar, monthKey);
    } else {
      setCalendar(null);
      console.log("No such document!");
    }
  };

  const createCalendar = async (user: User, name: string, standardTime: number, week: Week) => {
    const newEntryPath = `time-manager-v2/${user.uid}/calendars`;
    await addDoc(collection(db, newEntryPath), {
      name,
      standardTime,
      week,
      months: {},
      created_at: new Date(),
    });
  }

  const calendarPath = (user: User, calendar_id: string) => {
    return `time-manager-v2/${user.uid}/calendars/${calendar_id}`;
  }

  return {
    calendar,
    createCalendar,
    deleteCalendar,
    fetchSingleCalendar,
    updateCalendar,
    updateMonths,
  };
}

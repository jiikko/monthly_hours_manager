import type {User} from '@firebase/auth';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc} from 'firebase/firestore';
import {Calendar} from 'lib/calendar';
import {db} from "lib/firebase";
import {useState} from 'react';
import {Week} from '../lib/calendar';

export const useManageCalendar = () => {
  const [calendar, setCalendar] = useState<Calendar>(undefined);
  // NOTE: calendar.monthsを更新した時に再レンダリングしてくれないので対策のためのstate. useReducerに変更すれば不要らしい
  const [_, setCalendarMonth] = useState(null);

  const updateCalendarForReRender = (calendar: Calendar, monthKey?: string) => {
    setCalendar(calendar)
    if(monthKey && calendar.months) { setCalendarMonth(calendar.months[monthKey]) }
  }

  const updateMonths = async (calendar: Calendar, user: User, monthKey: string) => {
    const entryPath = calendarPath(user, calendar.id);
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
      week: week.toObject(),
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
      const calendar = new Calendar(doc.name, doc.standardTime, Week.parse(doc.week), doc.months, false, docSnap.id, doc.created_at.toDate())
      calendar.sortByMonthKey();
      updateCalendarForReRender(calendar, monthKey);
    } else {
      setCalendar(null);
      console.log("No such document!");
    }
  };

  const fetchCalendars = async (user: User) => {
    const q = query(collection(db, `time-manager-v2/${user.uid}/calendars`));
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const calendar = new Calendar(data.name, data.standardTime, Week.parse(data.week), data.months, false, doc.id, data.created_at.toDate());
      list.push(calendar);
    });
    list.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return list
  }

  const createCalendar = async (user: User, name: string, standardTime: number, week: Week) => {
    const newEntryPath = `time-manager-v2/${user.uid}/calendars`;
    await addDoc(collection(db, newEntryPath), {
      name,
      standardTime,
      week: week.toObject(),
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
    fetchCalendars,
    fetchSingleCalendar,
    updateCalendar,
    updateMonths,
  };
}

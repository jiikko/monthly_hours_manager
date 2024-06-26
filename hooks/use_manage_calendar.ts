import type {User} from '@firebase/auth';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, where, query, runTransaction, updateDoc} from 'firebase/firestore';
import {Calendar} from 'lib/calendar';
import {db} from "lib/firebase";
import {useState} from 'react';
import {Week} from '../lib/calendar';

class CalendarError extends Error {
  constructor(message) {
    super(message);
    this.name = "CalendarError";
  }
}

export class CalendarNotFoundError extends CalendarError {
  constructor() {
    super("カレンダーが存在しません。");
  }
}

export class OutdatedCalendarError extends CalendarError {
  constructor() {
    super("他の画面で更新されているため更新できません。再度読み込んでください。");
  }
}

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

  const updateMonthsWithLock = async (calendar: Calendar, user: User, monthKey: string): Promise<boolean> => {
    const entryPath = calendarPath(user, calendar.id);
    const docRef = doc(db, entryPath);

    const result = await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);
      if (!docSnapshot.exists()) {
        throw new CalendarNotFoundError();
      }

      const data = docSnapshot.data();
      const beforeCalendar = new Calendar(data.name, data.standardTime, Week.parse(data.week), data.months, false, docSnapshot.id, data.created_at.toDate(), data.displayOrder, data.lockVersion);
      const currentVersion = beforeCalendar.lockVersion || 0;
      if (calendar.lockVersion && currentVersion !== calendar.lockVersion) {
        throw new OutdatedCalendarError();
      }

      if(calendar.isEqual(beforeCalendar)) {
        console.log('no update')
        return false
      }

      calendar.lockVersion = currentVersion + 1;
      transaction.update(docRef, { months: calendar.months, lockVersion: calendar.lockVersion });
      return true;
    }).then((updated) => {
      updateCalendarForReRender(calendar, monthKey);
      return updated;
    });

    return result;
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

  const updateCalendarWithLock = async (user: User, calendar_id: string, name: string, standardTime: number, week: Week, lockVersion: number) => {
    const entryPath = calendarPath(user, calendar_id);
    const docRef = doc(db, entryPath);

    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists()) {
        throw new CalendarNotFoundError();
      }

      const currentVersion = docSnapshot.data().lockVersion || 0;

      if (lockVersion && currentVersion !== lockVersion) {
        throw new OutdatedCalendarError();
      }

      transaction.update(docRef, {
        name: name,
        standardTime: standardTime,
        week: week.toObject(),
        lockVersion: currentVersion + 1
      });
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

      const calendar = new Calendar(doc.name, doc.standardTime, Week.parse(doc.week), doc.months, false, docSnap.id, doc.created_at.toDate(), doc.displayOrder, doc.lockVersion)
      calendar.sortByMonthKey();
      updateCalendarForReRender(calendar, monthKey);
    } else {
      setCalendar(null);
      console.log("No such document!");
    }
  };

  const fetchCalendars = async (user: User) => {
    const q = query(
      collection(db, `time-manager-v2/${user.uid}/calendars`),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const calendar = new Calendar(data.name, data.standardTime, Week.parse(data.week), data.months, false, doc.id, data.created_at.toDate(), data.displayOrder)
      list.push(calendar);
    });

    return list
  }

  const fetchNextDisplayOrder = async (user: User): Promise<number> => {
    const q = query(
      collection(db, `time-manager-v2/${user.uid}/calendars`),
      orderBy('displayOrder', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return 1; // カレンダーがない場合は1を返す
    } else {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return (data.displayOrder || 0) + 1; // 最大のdisplay_orderに1を加えた値を返す
    }
  };

  const updateCalendarDisplayOrder = async (
    user: User,
    activeCalendarId: string,
    overCalenderId: string,
    activeDisplayOrder: number,
    oldDisplayOrder: number,
  ): Promise<void> => {
    await runTransaction(db, async (transaction) => {
      const activeCalendarRef = doc(db, `time-manager-v2/${user.uid}/calendars`, activeCalendarId);
      const offset = activeDisplayOrder < oldDisplayOrder ? 1 : 0;
      const calendarsRef = collection(db, `time-manager-v2/${user.uid}/calendars`);
      const q = query(
        calendarsRef,
        where("displayOrder", ">=", oldDisplayOrder + offset),
        orderBy("displayOrder")
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const calendarData = doc.data();
        if (doc.id !== activeCalendarId) {
          transaction.update(doc.ref, { displayOrder: calendarData.displayOrder + 1 });
        }
      });

      transaction.update(activeCalendarRef, { displayOrder: oldDisplayOrder + offset });
    });
  }

  const createCalendar = async (user: User, name: string, standardTime: number, week: Week) => {
    const newEntryPath = `time-manager-v2/${user.uid}/calendars`;
    const nextDisplayOrder = await fetchNextDisplayOrder(user);

    await addDoc(collection(db, newEntryPath), {
      name,
      standardTime,
      week: week.toObject(),
      months: {},
      displayOrder: nextDisplayOrder,
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
    updateCalendarWithLock,
    updateMonths,
    updateMonthsWithLock,
    updateCalendarForReRender,
    setCalendar,
    updateCalendarDisplayOrder,
  };
}

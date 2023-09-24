import {CalendarCollectionContext} from 'contexts/calendar_collection_context';
import {useCurrentUser} from 'hooks/use_current_user';
import {useManageCalendar} from 'hooks/use_manage_calendar';
import {Calendar} from 'lib/calendar';
import {useEffect, useState} from 'react';

type Props = {
  children: React.ReactNode;
}

export function RequiredCalendarCollection({ children }: Props) {
  const { user } = useCurrentUser()
  const [calendars, setCalendars] = useState<Calendar[]>(undefined);
  const { fetchCalendars } = useManageCalendar();

  useEffect(() => {
    fetchCalendars(user).then((calendars) => {
      setCalendars(calendars)
    })
  }, [])

  return(
    <>
      <CalendarCollectionContext.Provider value={{ calendars }}>
        {calendars && children}
      </CalendarCollectionContext.Provider>
    </>
  )
}

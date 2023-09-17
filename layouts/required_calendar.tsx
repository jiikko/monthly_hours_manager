import { AuthContext} from 'contexts/auth_context'
import { CalendarContext } from 'contexts/calendar_context';
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useManageCalendar } from 'hooks/use_manage_calendar';

type RequiredCalendarProps = {
  children: React.ReactNode;
}

export function RequiredCalendar({ children }: RequiredCalendarProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const calendar_id = typeof router.query.calendar_id === 'string' ? router.query.calendar_id : null;
  const { fetchSingleCalendar, calendar } = useManageCalendar();

  useEffect(() => {
    if(calendar_id) { fetchSingleCalendar(user, calendar_id) }
  }, [calendar_id])

  if(calendar === undefined) { return null }
  if(calendar === null) { return(<div className="alert alert-danger" role="alert">カレンダーが見つかりませんでした。</div>) }

  return(
    <>
      <CalendarContext.Provider value={{ calendar, calendar_id }}>
        {children}
      </CalendarContext.Provider>
    </>
  )
}


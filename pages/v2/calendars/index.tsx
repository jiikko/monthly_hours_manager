import type { NextPageWithLayout } from './../../_app'
import { Layout } from '../../../layouts/v2';
import { useEffect, useState } from 'react';
import { Calendar } from 'lib/calendar';
import { useManageCalendar } from 'hooks/use_manage_calendar';
import { CalendarCollection } from 'components/calendar_collection';
import { useCurrentUser } from 'hooks/use_current_user';

const Page: NextPageWithLayout = () => {
  const { user } = useCurrentUser()
  const [calendars, setCalendars] = useState<Calendar[]>(undefined);
  const { fetchCalendars } = useManageCalendar();

  useEffect(() => {
    fetchCalendars(user).then((calendars) => {
      setCalendars(calendars)
    })
  }, [])

  return (
    <>
      {calendars && <CalendarCollection calendars={calendars} />}
    </>
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

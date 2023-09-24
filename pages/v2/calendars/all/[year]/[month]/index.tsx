import {AllCalendarMonth} from 'components/all_calendar_month';
import {useCurrentUser} from 'hooks/use_current_user';
import {useManageCalendar} from 'hooks/use_manage_calendar';
import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import {Calendar} from 'lib/calendar';
import {useRouter} from 'next/router';
import type {NextPageWithLayout} from 'pages/_app';
import {useEffect, useState} from 'react';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;

  const { user } = useCurrentUser()
  const [calendars, setCalendars] = useState<Calendar[]>(undefined);
  const { fetchCalendars } = useManageCalendar();

  useEffect(() => {
    fetchCalendars(user).then((calendars) => {
      setCalendars(calendars)
    })
  }, [])

  return (
    calendars && <AllCalendarMonth year={Number(year)} month={Number(month)} calendars={calendars} />
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        {page}
      </RequiredUser>
    </Layout>
  )
}

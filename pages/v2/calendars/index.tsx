import {CalendarCollection} from 'components/calendar_collection';
import {useCalendarCollection} from 'hooks/use_calendar_collection';
import {RequiredCalendarCollection} from 'layouts/required_calendar_collection';
import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import type {NextPageWithLayout} from 'pages/_app';

const Page: NextPageWithLayout = () => {
  const { calendars } = useCalendarCollection()

  return (
    <CalendarCollection calendars={calendars} />
  )
}

export default Page

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RequiredUser>
        <RequiredCalendarCollection>
          {page}
        </RequiredCalendarCollection>
      </RequiredUser>
    </Layout>
  )
}

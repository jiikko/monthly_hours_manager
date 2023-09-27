import {AllCalendarMonth} from 'components/all_calendar_month';
import {useCalendarCollection} from 'hooks/use_calendar_collection';
import {RequiredCalendarCollection} from 'layouts/required_calendar_collection';
import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import {useRouter} from 'next/router';
import type {NextPageWithLayout} from 'pages/_app';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  const { calendars } = useCalendarCollection()

  return (
    <AllCalendarMonth year={Number(year)} month={Number(month)} calendars={calendars} />
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

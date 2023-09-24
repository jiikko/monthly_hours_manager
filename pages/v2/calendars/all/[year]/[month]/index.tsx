import {RequiredUser} from 'layouts/required_user';
import {Layout} from 'layouts/v2';
import {useRouter} from 'next/router';
import { AllCalendarMonth } from 'components/all_calendar_month';
import type {NextPageWithLayout} from 'pages/_app';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;
  if(year === undefined || month === undefined) { return <></> }

  const days = []

  return (
    <AllCalendarMonth year={Number(year)} month={Number(month)} days={days} />
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

import type { NextPageWithLayout } from './_app'
import { Layout } from '../components/layout';
import { JsonParameter } from '../lib/json_parameter';
import { useRouter } from 'next/router';
import { About } from '../components/about';
import { Calendar } from '../lib/calendar';
import { useContext } from 'react';
import { AuthContext} from '../contexts/auth_context'

const Page: NextPageWithLayout = () => {
  const { loggedInEmail } = useContext(AuthContext);
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const calendarName = jsonObject.name;
  const calendarStandardTime = jsonObject.standardTime;
  const calendarWeek = jsonObject.week;
  const calendarMonths = jsonObject.months;
  const calendar = new Calendar(calendarName, calendarStandardTime, calendarWeek, calendarMonths);
  console.log(loggedInEmail);

  return (
    <About calendar={calendar} />
  )
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

import type { NextPageWithLayout } from './_app'
import { Layout } from '../components/layout';
import { About } from '../components/about';
import { useCalendarState } from '../hooks/use_calendar_state';

const Page: NextPageWithLayout = () => {
  const { calendar } = useCalendarState();

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

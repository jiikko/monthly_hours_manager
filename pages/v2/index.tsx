import type { NextPageWithLayout } from '../_app'
import { Layout } from '../../layouts/v2';
import { AboutWithoutSetting } from 'components/about_without_setting';

const Page: NextPageWithLayout = () => {
  return (
    <AboutWithoutSetting />
  )
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

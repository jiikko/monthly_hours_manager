import type { NextPageWithLayout } from 'pages/_app'
import { Layout } from 'layouts/v2';
import { useRouter } from 'next/router';
import { RequiredUser } from 'layouts/required_user';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { year, month } = router.query;

  return (
    <>
      <h1>集約した{year}年{month}月のカレンダー</h1>
    </>
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

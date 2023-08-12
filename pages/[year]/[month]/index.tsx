import Layout from '../../../components/layout';
import { useRouter } from 'next/router';

function Page() {
  const router = useRouter();
  const { year, month } = router.query;

  return (
    <Layout>
      <h1>{year}年{month}月</h1>
    </Layout>
  );
}

export default Page;

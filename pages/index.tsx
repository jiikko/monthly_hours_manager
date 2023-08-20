import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { JsonParameter } from '../lib/json_parameter';
import { useRouter } from 'next/router';
import { About } from '../components/about';

const Page: React.FC= ({}) => {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));

  return (
    <About jsonObject={jsonObject} />
  )
}

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

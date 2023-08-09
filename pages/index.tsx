import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <h1 className={styles.title}>
        精算幅の時間管理くん
      </h1>

      <div>
        <a href="https://nextjs.org/docs">
          <h3>今月のカレンダーを作成する</h3>
        </a>
      </div>
    </Layout>
  )
}

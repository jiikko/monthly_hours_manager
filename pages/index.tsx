import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <div>
        <a href="/calendar_edit">
          今月のカレンダーを作成する
        </a>
      </div>
    </Layout>
  )
}

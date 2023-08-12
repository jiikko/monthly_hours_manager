import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { Container, Row } from 'react-bootstrap';

export default function Page() {
  return (
    <Layout>
      精算幅の時間管理を行うアプリケーションです。<br />
      カレンダーの設定を入力の上、月を表示して時間の計算に使ってください。
    </Layout>
  )
}

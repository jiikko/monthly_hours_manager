import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import JsonParameter from '../lib/json_parameter';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if(router.isReady) { setDisplay(true); }
  }, [router.isReady]);

  return (
    <Layout>
      <Row>
        精算幅の時間管理を行うアプリケーションです。<br /><br />
      </Row>

      <Row>
        <Col>
          <h2>使い方</h2>
          <ol>
            <li>カレンダーの設定を入力する</li>
            <li>月を表示する</li>
            <li>時間を入力する</li>
          </ol>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>設定情報</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>名前</th>
                <th>基準時間</th>
                <th>稼働曜日</th>
                <th>管理中の月</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{jsonObject.name}</td>
                <td>{jsonObject.standardTime}時間</td>
                <td>{display && Object.keys(jsonObject.week).filter(key => jsonObject.week[key]).join(', ')}</td>
                <td>{display && Object.keys(jsonObject.months)}</td>
              </tr>
            </tbody>
            </Table>
          </Col>
        </Row>
      </Layout>
    )
}

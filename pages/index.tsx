import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { Table, Row, Form, Button, Col, FloatingLabel } from 'react-bootstrap';
import { JsonParameter } from '../lib/json_parameter';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if(router.isReady) { setDisplay(true); }
  }, [router.isReady]);

  const renderSetting = () => {
    return(
      <Row>
        <Col>
          <h2 className='mb-3'>現在の設定情報</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>名前</th>
                <th>基準時間</th>
                <th>稼働曜日</th>
                <th>管理対象の月</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{jsonObject.name}</td>
                <td>{jsonObject.standardTime && `${jsonObject.standardTime}時間`}</td>
                <td>{display && jsonObject.week && Object.keys(jsonObject.week).filter(key => jsonObject.week[key]).join(', ')}</td>
                <td>{display && jsonObject.months && Object.keys(jsonObject.months)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  }

  return (
    <Layout>
      <Row>
        月毎の基準時間を管理するアプリケーションです。<br /><br />
      </Row>

      <Row>
        <Col>
          <h2>仕組み・注意点</h2>
          <ol>
            <li>クエリパラメータのみで情報を保持しています</li>
            <li>外部サーバは使っていません</li>
            <li>認証の機構がないのでURLの取り扱いには注意してください</li>
          </ol>

          <h2>使い方</h2>
          <ol>
            <li>カレンダーの設定を入力する</li>
            <li>月を表示する</li>
            <li>時間を入力する</li>
          </ol>
        </Col>
      </Row>

      {jsonObject.week && renderSetting()}
    </Layout>
  )
}

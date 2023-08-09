import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { Container, Row } from 'react-bootstrap';

export default function Home() {
  return (
    <Layout>
      <Container>
        <Row className="justify-content-md-between">
          ここになんらかを表示する
        </Row>
      </Container>
    </Layout>
  )
}
